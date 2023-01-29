import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { AiOutlineSearch } from "react-icons/ai";
import Loading from "components/Loading";
import NoResult from "components/NoResult";
import Pagination from "components/Pagination";
import SeriesCard from "../components/SeriesCard";
import { GET_ONGOING_SERIES } from "../graphql/queries/series";
import { useStoreContext } from "../lib/context";
import apolloClient from "../utils/apolloClient";
const Ongoing = () => {
  // const [results] = useQuery({ query: GET_ONGOING_SERIES });
  // const { data, fetching, error } = results;
  // const info = data?.seriesDetails?.data;

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Ugh.. {error?.message}</p>;
  const { fetch } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    sizePerPage: 10,
    keywords: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const getOngoingSeries = async () => {
    setLoading(true);
    try {
      const {
        data: { seriesDetails },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ONGOING_SERIES,
        variables: {
          page: query.page,
          pageSize: query.sizePerPage,
          filters: {
            and: {
              status: { eq: "ongoing" },
              or: [
                { casts: { castName: { containsi: query?.keywords } } },
                { title: { containsi: query?.keywords } },
              ],
            },
          },
        },
      });
      const seriesInfo = seriesDetails?.data?.map((series) => {
        return {
          id: series?.id,
          rating: series?.attributes?.rating,
          status: series?.attributes?.status,
          title: series?.attributes?.title,
          slug: series?.attributes?.slug,
          saved: series?.attributes?.saved,
          genre: series?.attributes?.genre,
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

      setInfo(seriesInfo);
      setPageCount(seriesDetails?.meta?.pagination?.pageCount);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handlePageChange = (page) => {
    setQuery({ ...query, page: page });
  };
  const handleSearch = (value) => {
    setQuery({ ...query, keywords: value });
  };
  useEffect(() => {
    getOngoingSeries();
  }, [fetch, query]);

  return (
    <div>
      <div css={styles.container}>
        <div className="d-flex justify-content-between">
          <h2 css={styles.title}>All Ongoing Series</h2>
          <div css={styles.searchContainer}>
            <form>
              <input
                type="text"
                css={styles.searchInput}
                placeholder="Search Here ..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <AiOutlineSearch css={styles.searchIcon} />
            </form>
          </div>
        </div>
        <div css={styles.pagination}>
          {info.length > 0 && (
            <Pagination
              {...query}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
        <div css={styles.seriesContainer}>
          {(loading && <Loading />) ||
            (info.length === 0 && <NoResult />) ||
            info.map((seriesCard) => (
              <SeriesCard key={seriesCard.id} seriesCard={seriesCard} />
            ))}
        </div>
        <div css={styles.pagination}>
          {info.length > 0 && (
            <Pagination
              {...query}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Ongoing;
const styles = {
  container: css`
    padding: 2em;
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-primary);
  `,
  title: css`
    text-align: center;
    margin-left: 20em;
    margin-bottom: 1em;
    font-size: 1.8rem;
    color: var(--color-text-primary);
    font-weight: 600;
  `,

  seriesContainer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em 4em;
  `,
  pagination: css`
    margin-top: 2em;
    margin-bottom: 2em;
  `,
  searchContainer: css`
    position: relative;
  `,
  searchInput: css`
    padding: 0.5em 2em;
    border: none;
    border-radius: 5px;
    color: #1a120b;
    font-weight: 500;
    &:focus {
      outline: none;
      border: 1px solid #fff;
    }
  `,
  searchIcon: css`
    position: absolute;
    right: 18px;
    top: 14px;
    color: #1a120b;
  `,
};
