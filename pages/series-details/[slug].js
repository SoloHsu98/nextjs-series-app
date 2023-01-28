import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaDownload } from "react-icons/fa";
import { AiFillStar, AiFillEye } from "react-icons/ai";
import { GET_SERIES } from "../../graphql/queries/singleSeries";
import { GET_SIMILAR_SERIES } from "../../graphql/queries/series";
import apolloClient from "../../utils/apolloClient";
import { useStoreContext } from "lib/context";

const SeriesDetails = () => {
  const [readMore, setReadMore] = useState(false);
  const { query } = useRouter();
  // const [results] = useQuery({
  //   query: GET_SERIES,
  //   variables: { slug: query?.slug },
  // });
  // const { data, fetching, error } = results;
  // const info = data?.seriesDetails?.data[0]?.attributes;

  // const [similarItems] = useQuery({
  //   query: GET_SIMILAR_SERIES,
  //   variables: { genre: query?.genre, id: query?.seriesId, pageSize: 4 },
  // });
  // const {
  //   data: similarSeriesData,
  //   fetching: dataFetching,
  //   error: fetchErr,
  // } = similarItems;
  // const similarSeries = data?.seriesDetails?.data

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Ugh.. {error?.message}</p>;
  const { fetch } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [genre, setGenre] = useState("WuXia");

  const getSeries = async () => {
    setLoading(true);
    try {
      const {
        data: { seriesDetails },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SERIES,
        variables: { slug: query?.slug },
      });

      const seriesInfo = seriesDetails?.data?.map((series) => {
        setGenre(series?.attributes?.genre);
        return {
          id: series?.id,
          rating: series?.attributes?.rating || "N/A",
          status: series?.attributes?.status,
          title: series?.attributes?.title,
          slug: series?.attributes?.slug,
          saved: series?.attributes?.saved,
          casts: series?.attributes?.casts?.data,
          genre: series?.attributes?.genre,
          plotSummary: series?.attributes?.plotSummary,
          totalEpisodes: series?.attributes?.totalEpisodes,
          poster:
            series?.attributes?.poster?.data[0]?.attributes?.formats?.medium
              ?.url ||
            series?.attributes?.poster?.data[0]?.attributes?.formats?.thumbnail
              ?.url,
        };
      });

      setSingleData(seriesInfo);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getSimilarSeries = async () => {
    setLoading(true);
    try {
      const {
        data: { seriesDetails },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SIMILAR_SERIES,
        variables: { genre: genre, slug: query?.slug, pageSize: 4 },
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
        };
      });

      setInfo(seriesInfo);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSimilarSeries();
    getSeries();
  }, [fetch, query?.slug]);

  return (
    <div css={styles.mainContainer}>
      <div css={styles.detailContainer}>
        <div css={styles.detailInfo}>
          <div className="d-flex flex-column">
            <div css={styles.imageCard}>
              <img src={singleData[0]?.poster} alt="poster" />
            </div>
            <div className="mt-4">
              <button
                css={styles.actionBtn}
                className="mb-3 d-flex align-items-center gap-4"
              >
                <FaDownload /> Download Now
              </button>
              <button
                css={styles.actionBtn}
                className="mb-3 d-flex align-items-center gap-4"
              >
                <AiFillEye size={21} />
                Watch Now
              </button>
            </div>
          </div>

          <div>
            <div>
              <h3 css={styles.title}>{singleData[0]?.title}</h3>
              <p className="d-flex gap-3 mt-3">
                <span>{singleData[0]?.year}</span>
                <span className="d-flex align-items-center gap-1">
                  <AiFillStar />
                  {singleData[0]?.rating} / 10
                </span>
              </p>
              <p>Romance / {singleData[0]?.genre} / Fantasy</p>
              <p>
                <b>{singleData[0]?.totalEpisodes}</b> Episodes
              </p>
            </div>
            <div className="mt-5">
              <h3 css={styles.title}>Casts</h3>
              <ul css={styles.castList}>
                {singleData[0]?.casts?.map((actor) => (
                  <li key={actor?.id}>{actor?.attributes?.castName}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h4 css={styles.similarTitle}>Similar Series</h4>
          <div css={styles.similarSeries}>
            {info?.map((series) => (
              <Link key={series.id} href={`/series-details/${series?.slug}`}>
                <div css={styles.similarImg}>
                  <img src={series?.poster} alt={series?.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 css={styles.plotSummary}>Plot Summary</h4>
        {readMore ? (
          <p className="mb-0">
            {singleData[0]?.plotSummary}
            <span
              css={styles.readMore}
              className="ms-2"
              onClick={() => {
                setReadMore(false);
              }}
            >
              See Less
            </span>
          </p>
        ) : (
          <p className="mb-0">
            {singleData[0]?.plotSummary?.substring(0, 200)} ...{" "}
            <span
              css={styles.readMore}
              onClick={() => {
                setReadMore(true);
              }}
            >
              Read More
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
const styles = {
  mainContainer: css`
    width: 100%;
    height: auto;
    padding: 2em;
    padding-top: 3em;
    color: #fff;
    background-color: #1a120b;
  `,
  detailContainer: css`
    display: flex;
    justify-content: space-between;
    p,
    span {
      font-size: 1.2em;
    }
  `,
  detailInfo: css`
    display: flex;
    gap: 7em;
    width: 99%;
  `,
  imageCard: css`
    width: 300px;
    height: 450px;
    border: 2px solid #fff;
    border-radius: 8px;
    margin-bottom: 1em;
    cursor: pointer;
    filter: drop-shadow(10px 8px 8px rgba(0, 0, 0, 0.4));
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  `,
  title: css`
    font-size: 1.8em;
    font-weight: 500;
  `,
  similarTitle: css`
    font-size: 1.5em;
    font-weight: 400;
    text-align: center;
    margin-left: 4.5em;
    margin-bottom: 1.5em;
  `,
  castList: css`
    margin-top: 1em;
    padding-left: 1.8em;
    li {
      line-height: 2em;
      font-weight: 500;
      font-size: 1.2em;
    }
  `,
  similarSeries: css`
    display: flex;
    gap: 2em;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: flex-end;
  `,
  similarImg: css`
    width: 120px;
    height: 180px;
    border: 2px solid #fff;
    border-radius: 8px;
    margin-bottom: 1em;
    cursor: pointer;
    filter: drop-shadow(10px 8px 8px rgba(0, 0, 0, 0.4));
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    &:hover {
      border: 2px solid #486af5;
    }
  `,
  actionBtn: css`
    border: 1px solid #fff;
    outline: none;
    background-color: #3c2a21;
    color: #fff;
    padding: 1em 2em;
    border-radius: 8px;
    width: 100%;
    font-size: 1.1em;
    font-weight: 500;
  `,
  plotSummary: css`
    font-size: 1.5em;
    font-weight: 400;
    margin-top: 1em;
    margin-bottom: 1em;
  `,
  readMore: css`
    font-size: 0.8em;
    font-weight: 700;
    cursor: pointer;
  `,
};
