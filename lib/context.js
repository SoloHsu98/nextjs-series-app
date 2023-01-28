import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_SERIES_DETAIL } from "../graphql/mutations/series";
import { GET_SAVED_SERIES } from "../graphql/queries/series";
import { v4 as uuid } from "uuid";
import apolloClient from "../utils/apolloClient";
import { GET_COLLECTION } from "graphql/queries/collections";
import { toast } from "react-toastify";
import _ from "lodash";
const StoreContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [fetch, setFetch] = useState(null);

  const [savedItems, setSavedItems] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const getSavedSeries = async () => {
    setLoading(true);
    let filters = { and: [] };
    filters.and = { saved: { eq: true } };
    if (!!selectedId) {
      filters.and = _.concat(filters.and, {
        collections: { id: { eq: parseInt(selectedId) } },
      });
    }
    try {
      const {
        data: { seriesDetails },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SAVED_SERIES,
        variables: {
          filters: filters,
        },
      });

      const seriesInfo = seriesDetails?.data?.map((series) => {
        return {
          id: series?.id,
          rating: series?.attributes?.rating,
          status: series?.attributes?.status,
          title: series?.attributes?.title,
          saved: series?.attributes?.saved,
          genre: series?.attributes?.genre,
          poster:
            series?.attributes?.poster?.data[0]?.attributes?.formats?.medium
              ?.url ||
            series?.attributes?.poster?.data[0]?.attributes?.formats?.thumbnail
              ?.url,
        };
      });

      setSavedItems(seriesInfo);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getCollection = async () => {
    try {
      const {
        data: { collections },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_COLLECTION,
        pageSize: 10,
      });

      const collection = collections?.data?.map((item) => {
        return {
          id: item.id,
          name: item?.attributes?.name,
          series: item?.attributes.series_details?.data?.map(
            (seriesData) => seriesData?.id
          ),
        };
      });
      setAllCollections(collection);
    } catch (error) {
      toast.error("Fail to get collections !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleDropdownToggle = () => {
    setCollectionDropdownOpen(!collectionDropdownOpen);
  };

  const handleSelectCollection = (collection) => {
    setSelectedId(collection?.id);
    setSelectedCollection(collection?.name);
  };

  useEffect(() => {
    getSavedSeries();
    getCollection();
  }, [fetch, selectedId]);

  const handleRefresh = () => {
    setFetch(uuid());
  };
  const contextValue = {
    showSavedItems,
    setShowSavedItems,
    savedItems,
    fetch,
    handleRefresh,
    savedItems,
    handleSelectCollection,
    handleDropdownToggle,
    collectionDropdownOpen,
    selectedCollection,
    allCollections,
    setSelectedCollection,
    setSelectedId,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
