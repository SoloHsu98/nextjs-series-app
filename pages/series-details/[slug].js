import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCommentAlt, FaDownload } from "react-icons/fa";
import { AiFillStar, AiFillEye } from "react-icons/ai";
import { useUser } from "@auth0/nextjs-auth0/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuid } from "uuid";
import { GET_SERIES } from "../../graphql/queries/singleSeries";
import { GET_SIMILAR_SERIES } from "../../graphql/queries/series";
import { GET_COMMENTS } from "graphql/queries/comments";
import apolloClient from "../../utils/apolloClient";
import { useStoreContext } from "lib/context";
import profile from "../../public/defaultProfile.jpeg";
import dayjs from "dayjs";
import { CREATE_COMMENTS } from "graphql/mutations/comment";
import { useMutation } from "@apollo/client";
import { BsChatSquareText } from "react-icons/bs";
import { Spinner } from "reactstrap";
const SeriesDetails = () => {
  const [readMore, setReadMore] = useState(false);
  const { query } = useRouter();
  const { user, error, isLoading } = useUser();
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
  const [allComments, setAllComments] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [seriesId, setSeriesId] = useState(null);
  const [fetchComment, setFetchComment] = useState(null);
  const [hasMoreCmt, setHasMoreCmt] = useState(true);
  const [page, setPage] = useState(1);
  const [cmtPageCount, setCmtPageCount] = useState(0);
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
        setSeriesId(series?.id);
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

  const getComments = async () => {
    setLoading(true);
    try {
      const {
        data: { comments },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_COMMENTS,
        variables: {
          page: page,
          pageSize: 3,
          filters: {
            series_details: { slug: { eq: query?.slug } },
          },
        },
      });

      const allData = page == 1 ? [] : allComments;
      const newData = comments?.data;
      setAllComments([...allData, ...newData]);
      setCmtPageCount(comments?.meta?.pagination?.pageCount);
      setTotalComments(comments?.meta?.pagination?.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSimilarSeries();
    getSeries();
    getComments();
  }, [fetch, query?.slug]);

  useEffect(() => {
    getComments();
  }, [fetchComment, page]);

  const [createComments] = useMutation(CREATE_COMMENTS, {
    client: apolloClient,
    onCompleted: () => {
      setFetchComment(uuid());
      setCommentText("");
      setPage(1);
      setHasMoreCmt(true);
    },
    onError: (err) => console.log("error", err),
  });
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    await createComments({
      variables: {
        data: {
          series_details: parseInt(seriesId),
          username: user?.name,
          profile: user?.picture || null,
          comment: commentText,
        },
      },
    });
  };
  const fetchMoreComment = () => {
    if (page === cmtPageCount || !cmtPageCount) {
      setHasMoreCmt(false);
    } else {
      setPage(page + 1);
    }
  };
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
      <div css={styles.commentSectionWrapper}>
        <section css={styles.commentContainer}>
          {totalComments === 0 ? (
            <p css={styles.commentCount}>
              <FaCommentAlt color={"var(--color-text-primary)"} />
              <span className="ms-3">No Comments Yet</span>
            </p>
          ) : (
            <p css={styles.commentCount}>
              <FaCommentAlt color={"var(--color-text-primary)"} />
              <span className="ms-3">{totalComments} Comments </span>
            </p>
          )}

          {/* dayjs(cell).format('DD MMMM YYYY, h:mm') */}
          <div css={styles.commentCard} id="scrollableContainer">
            {totalComments === 0 ? (
              <div css={styles.noComment}>
                <span>
                  <BsChatSquareText size={32} />
                </span>
                <span>Be the first to comment</span>
              </div>
            ) : (
              <InfiniteScroll
                hasMore={hasMoreCmt}
                next={fetchMoreComment}
                dataLength={allComments?.length}
                loader={
                  <Spinner color="white" style={{ textAlign: "center" }} />
                }
                endMessage={
                  <p className="p-3" style={{ textAlign: "center" }}>
                    No More Comment
                  </p>
                }
                css={styles.infiniteScroll}
                scrollableTarget="scrollableContainer"
              >
                {allComments?.map((comment, index) => (
                  <div key={index} css={styles.card}>
                    <img
                      src={
                        comment?.attributes?.profile
                          ? comment?.attributes?.profile
                          : profile.src
                      }
                      alt="user-profile"
                      css={styles.profile}
                    />
                    <div css={styles.commentInfo}>
                      <div css={styles.userInfo}>
                        <span css={styles.commentor}>
                          {comment?.attributes?.username}
                        </span>
                        <span>
                          {dayjs(comment?.attributes?.createdAt).format(
                            "DD MMM YYYY, h:mm a"
                          )}
                        </span>
                      </div>
                      <span css={styles.comment}>
                        {comment?.attributes?.comment}
                      </span>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>
        </section>
        <section css={styles.inputSection}>
          <p className="mb-3">Leave Your Comment Here</p>
          <form css={styles.formContainer}>
            <div className="form-group">
              <textarea
                type="textarea"
                className="form-control"
                id="comment"
                placeholder="Write a comment ..."
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            <button
              css={styles.submitBtn}
              onClick={(e) => handleSubmitComment(e)}
            >
              Submit
            </button>
          </form>
        </section>
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
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
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
      border: 2px solid var(--color-btn-hover);
    }
  `,
  actionBtn: css`
    border: 1px solid #fff;
    outline: none;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
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
  commentContainer: css`
    width: 100%;

    /* margin-top: 3em; */
    font-size: 1.5em;
  `,
  commentCard: css`
    /* border: 1px solid #fff; */
    background-color: transparent;
    color: var(--color-text-primary);
    padding: 1em 2em;
    border-radius: 8px;
    width: 50%;
    height: 300px;
    overflow: auto;
    font-size: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    margin-top: 1em;
    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
      border-radius: 10px;
      background-color: var(--color-bg-primary);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      height: 5px;
      background-color: var(--color-bg-secondary);
    }
  `,
  profile: css`
    width: 50px;
    height: 50px;
    border-radius: 50%;
  `,
  commentInfo: css`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  `,
  userInfo: css`
    display: flex;
    align-items: center;
    gap: 2em;
  `,
  commentor: css`
    font-size: 1.3em;
  `,
  comment: css`
    font-size: 1.2em;
    opacity: 0.8;
  `,
  commentCount: css`
    margin-bottom: 1em;
    padding: 0em 1em;
  `,
  inputSection: css`
    font-size: 1.3em;
    width: 50%;
    align-self: flex-end;
  `,
  commentSectionWrapper: css`
    display: flex;
    align-items: center;
    margin-top: 5em;
  `,
  formContainer: css`
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    textarea {
      resize: none;
      &:focus {
        outline: none;
        border: none;
      }
    }
  `,
  submitBtn: css`
    margin-top: 1em;
    align-self: flex-end;
    border: 1px solid #f4f4f4;
    padding: 0.5em 2em;
    background: var(--color-submit);
    font-size: 14px;
    color: #fff;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease 0s;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      background-color: var(--color-btn-hover);
      transform: translateY(-3px);
    }
    &:focus {
      outline: none;
    }
  `,
  card: css`
    display: flex;
    gap: 1.5em;
    background-color: var(--color-comment);
    color: var(--color-text-primary);
    border-radius: 8px;
    padding: 1em 2em;
    margin-bottom: 1.8em;
  `,
  noComment: css`
    padding: 3em 2em;
    gap: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 1.2em;
  `,
  infiniteScroll: css`
    &::-webkit-scrollbar {
      width: 0;
    }
  `,
};
