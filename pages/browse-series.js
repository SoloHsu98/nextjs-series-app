import _ from "lodash";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import SeriesCard from "../components/SeriesCard";
import Loading from "components/Loading";
import NoResult from "components/NoResult";
import { GET_ALL_SERIES } from "../graphql/queries/series";
import apolloClient from "../utils/apolloClient";
const BrowseSeries = () => {
  const [allSeries, setAllSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    sizePerPage: 10,
    keywords: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const [filter, setFilter] = useState([]);
  const [filterItems, setFilterItems] = useState({
    genre: "",
    rating: "",
    year: "",
    orderBy: "",
  });
  const filterData = {
    genre: ["WuXia", "XianXia"],
    rating: ["1+", "2+", "3+", "4+", "5+", "6+", "7+", "8+", "9+"],
    year: [
      "2022",
      "2021",
      "2020",
      "2019",
      "2015 - 2018",
      "2010 - 2014",
      "2000 - 2009",
      "1997 - 1999",
    ],
    orderBy: ["rating", "year"],
  };

  const handleFilterChange = (e) => {
    setFilterItems({ ...filterItems, [e.target.name]: e.target.value });
  };
  const handleFilters = (e) => {
    //setFilter(filterItems);
    if (filterItems.genre == "All") {
      setFilterItems({ ...filterItems, genre: "" });
    } else if (filterItems.rating == "All") {
      setFilterItems({ ...filterItems, rating: "" });
    } else if (filterItems.year == "All") {
      setFilterItems({ ...filterItems, year: "" });
    } else if (filterItems.orderBy == "All") {
      setFilterItems({ ...filterItems, orderBy: "" });
    } else {
      setFilter(filterItems);
    }
    e.preventDefault();
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFilterItems({
      genre: "",
      rating: "",
      year: "",
      orderBy: "",
    });
    setFilter({
      genre: "",
      rating: "",
      year: "",
      orderBy: "",
    });
  };
  const handlePageChange = (page) => {
    setQuery({ ...query, page: page });
  };

  useEffect(() => {
    getAllSeries();
  }, [query, filter]);

  const getAllSeries = async () => {
    setLoading(true);
    let filters = { and: [] };

    filters = {
      and: [
        {
          or: [
            { title: { containsi: query.keywords } },
            { casts: { castName: { containsi: query.keywords } } },
            { rating: { containsi: parseFloat(query.keywords) } },
          ],
        },
      ],
    };

    if (filter?.genre?.length > 0) {
      filters.and = _.concat(filters.and, {
        genre: { eq: filter.genre },
      });
    }
    if (filter?.rating?.length > 0) {
      filters.and = _.concat(filters.and, {
        rating: { gte: parseFloat(filter?.rating?.charAt(0)) },
      });
    }
    if (filter?.year?.length > 0) {
      filters.and = _.concat(filters.and, {
        year: { in: filter?.year.split(" - ") },
      });
    }

    //console.log("filters", filters);
    const {
      data: { seriesDetails },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_ALL_SERIES,
      variables: {
        page: query.page,
        pageSize: query.sizePerPage,
        filters: filters,
        data: filter?.orderBy?.length > 0 ? filter?.orderBy : null,
      },
    });
    const seriesInfo = seriesDetails?.data?.map((series) => {
      return {
        id: series?.id,
        status: series?.attributes?.status,
        rating: series?.attributes?.rating,
        slug: series?.attributes?.slug,
        title: series?.attributes?.title,
        poster:
          series?.attributes?.poster?.data[0]?.attributes?.formats?.medium
            ?.url ||
          series?.attributes?.poster?.data[0]?.attributes?.formats?.thumbnail
            ?.url,
        collection: series?.attributes?.collections?.data?.map(
          (item) => item.id
        ),
      };
    });

    setPageCount(seriesDetails?.meta?.pagination?.pageCount);
    setAllSeries(seriesInfo);
    setLoading(false);
  };
  const handleSearch = (e) => {
    setQuery({ ...query, keywords: e.target.value });
  };
  return (
    <div css={styles.mainContainer}>
      <form>
        <div css={styles.searchContainer}>
          <div className="form-group mb-4">
            <label htmlFor="search" css={styles.label}>
              Search Term :
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Series Title, Cast or Rating"
              name="search"
              css={styles.inputStyle}
              onChange={handleSearch}
            />
          </div>
          <div className="d-flex justify-content-between">
            <div
              className="input-group mb-3 d-flex flex-column"
              css={styles.filteBox}
            >
              <label className="mb-2">Genre :</label>
              <select
                className="custom-select"
                name="genre"
                value={filterItems.genre}
                onChange={handleFilterChange}
              >
                <option>All</option>
                {filterData.genre.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="input-group mb-3 d-flex flex-column"
              css={styles.filteBox}
            >
              <label className="mb-2">Rating :</label>
              <select
                className="custom-select"
                name="rating"
                value={filterItems?.rating}
                onChange={handleFilterChange}
              >
                <option>All</option>
                {filterData.rating.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="input-group mb-3 d-flex flex-column"
              css={styles.filteBox}
            >
              <label className="mb-2">Year :</label>
              <select
                className="custom-select"
                name="year"
                value={filterItems?.year}
                onChange={handleFilterChange}
              >
                <option>All</option>
                {filterData.year.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="input-group mb-3 d-flex flex-column"
              css={styles.filteBox}
            >
              <label className="mb-2">OrderBy :</label>
              <select
                className="custom-select"
                name="orderBy"
                value={filterItems?.orderBy}
                onChange={handleFilterChange}
              >
                <option>All</option>
                {filterData.orderBy.map((data, index) => (
                  <option key={index} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4 gap-4">
            <button css={styles.searchBtn} onClick={handleReset}>
              Reset
            </button>
            <button css={styles.searchBtn} onClick={handleFilters}>
              Filter
            </button>
          </div>
        </div>
      </form>
      <div css={styles.pagination}>
        {allSeries.length > 0 && (
          <Pagination
            {...query}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
      <div>
        <h3 className="text-center my-5">All Series</h3>
        <div css={styles.allSeriesContainer}>
          {(loading && <Loading />) ||
            (allSeries.length === 0 && <NoResult />) ||
            allSeries.map((seriesCard) => (
              <SeriesCard key={seriesCard.id} seriesCard={seriesCard} />
            ))}
        </div>
      </div>
      <div css={styles.pagination}>
        {allSeries.length > 0 && (
          <Pagination
            {...query}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseSeries;
const styles = {
  mainContainer: css`
    width: 100%;
    height: auto;
    padding: 2em;
    padding-top: 3em;
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
  `,
  pagination: css`
    margin-top: 3em;
    margin-bottom: 0.5em;
  `,
  searchBtn: css`
    border: none;
    padding: 1em 3em;
    border-radius: 12px;
    color: var(--color-text-primary);
    background: var(--color-bg-secondary);
  `,

  searchContainer: css`
    .form-control {
      color: var(--color-text-primary);
      font-weight: 500;
      padding: 2em;
    }
    .custom-select {
      width: 100%;
      height: auto;
      padding: 1em;
      appearance: none;

      background: var(--color-bg-secondary)
        url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 4 5'%3E%3Cpath fill='%23ffffff' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
        no-repeat right 0.75rem center;
      border: none;
      color: var(--color-text-primary);
      &:focus,
      &:hover {
        border: none;
        outline: none;
        background: var(--color-bg-secondary)
          url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 4 5'%3E%3Cpath fill='%23ffffff' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
          no-repeat right 0.75rem center;
        box-shadow: none;
      }
    }
  `,

  allSeriesContainer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em 4em;
  `,
  searchInput: css``,
  label: css`
    font-weight: 500;
    margin-bottom: 0.5em;
  `,
  inputStyle: css`
    background: var(--color-bg-secondary);
    border: none;

    &:focus,
    &:hover {
      border: none;
      outline: none;
      background: var(--color-bg-secondary);
      box-shadow: none;
    }
  `,
  filteBox: css`
    width: 20%;
  `,
};
