import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import Loading from "./Loading";
import SeriesCard from "./SeriesCard";
import NoResult from "./NoResult";
import { GET_POPULAR_SERIES } from "../graphql/queries/series";
import { useStoreContext } from "../lib/context";
import apolloClient from "../utils/apolloClient";
const PopularSeries = () => {
  // const [results] = useQuery({
  //   query: GET_POPULAR_SERIES,
  //   variables: { pagination: { pageSize: 10 } },
  // });
  // const { data, fetching, error } = results;
  // const info = data?.seriesDetails?.data;

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Ugh.. {error?.message}</p>;
  const { fetch } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const getPopularSeries = async () => {
    setLoading(true);
    try {
      const {
        data: { seriesDetails },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_POPULAR_SERIES,
        pageSize: 10,
        variables: {
          filters: {
            status: { eq: "popular" },
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
          collection: series?.attributes?.collections?.data?.map(
            (item) => item.id
          ),
          poster:
            series?.attributes?.poster?.data[0]?.attributes?.formats?.medium
              ?.url ||
            series?.attributes?.poster?.data[0]?.attributes?.formats?.thumbnail
              ?.url,
        };
      });

      setInfo(seriesInfo);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPopularSeries();
  }, [fetch]);
  return (
    <div css={styles.container}>
      <div css={styles.headerWrapper}>
        <h2 css={styles.title}>Popular Series</h2>
        <Link href="/popular" css={styles.seeMoreLink}>
          <button css={styles.seeMoreBtn}>See More</button>
        </Link>
      </div>
      <div css={styles.seriesContainer}>
        {(loading && <Loading />) ||
          (info.length === 0 && <NoResult />) ||
          info.map((seriesCard) => (
            <SeriesCard key={seriesCard.id} seriesCard={seriesCard} />
          ))}
      </div>
    </div>
  );
};

export default PopularSeries;
const styles = {
  container: css`
    padding: 2em;
  `,
  title: css`
    margin-bottom: 0.8em;
    font-size: 1.7rem;
    color: #fff;
    font-weight: 500;
    text-align: center;
  `,
  seriesContainer: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2em 4em;
  `,
  seeMoreLink: css`
    align-self: center;
    border: 1px solid #f4f4f4;
    padding: 0.5em 0.8em;
    background: #3c2a21;
    font-size: 13px;
    color: #fff;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease 0s;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      background-color: rgba(88, 73, 64, 0.46);
      transform: translateY(-3px);
    }
    &:focus {
      outline: none;
    }
  `,
  seeMoreBtn: css`
    background: none;
    border: none;
    color: #fff;
  `,
  headerWrapper: css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 2.3em;
  `,
};
