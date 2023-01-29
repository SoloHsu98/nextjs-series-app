import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { toast } from "react-toastify";
import { BsPlus } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UPDATE_SERIES_DETAIL } from "../graphql/mutations/series";
import { GET_COLLECTION } from "../graphql/queries/collections";
import {
  CREATE_COLLECTIONS,
  UPDATE_COLLECTIONS,
} from "graphql/mutations/collection";
import { useStoreContext } from "../lib/context";
import apolloClient from "../utils/apolloClient";

const SeriesCard = ({ seriesCard }) => {
  const { handleRefresh, fetch } = useStoreContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [savedSeries, setSavedSeries] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { genre, poster, rating, slug, status, title, saved, id } = seriesCard;

  //console.log("seriesCard", seriesCard);
  const [updateSeries, { error: err, data }] = useMutation(
    UPDATE_SERIES_DETAIL,
    {
      client: apolloClient,
      onCompleted: () => {
        handleRefresh();
        handleSaveModalClose(actionStatus);
        actionStatus == "saved"
          ? toast.success("Successfully Saved !", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          : toast.success("Unsaved !", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
        //setRemoveSuccessModalOpen(true);
      },
      onError: (err) => console.log("error", err),
    }
  );
  const [updateCollection] = useMutation(UPDATE_COLLECTIONS, {
    client: apolloClient,
    onCompleted: () => {},
    onError: (err) => console.log("error", err),
  });

  const handleSaveModalOpen = (name) => {
    setModalOpen({
      [name]: true,
    });
  };
  const handleSaveModalClose = (name) => {
    setModalOpen({
      [name]: false,
    });
  };

  const handleUnsavedSeries = async () => {
    setActionStatus("unsaved");

    await updateSeries({
      variables: {
        id: parseInt(savedSeries?.id),
        data: {
          saved: false,
          collections: [],
        },
      },
    });

    handleSaveModalClose("unsaved");
  };

  const handleSavedSeries = async () => {
    if (allCollections.length < 1) {
      setActionStatus("saved");
      await updateSeries({
        variables: {
          id: parseInt(savedSeries?.id),
          data: {
            saved: true,
          },
        },
      });
    } else {
      if (selectedCollection === null) {
        setActionStatus("saved");
        await updateSeries({
          variables: {
            id: parseInt(savedSeries?.id),
            data: {
              saved: true,
            },
          },
        });

        await updateCollection({
          variables: {
            id: parseInt(allCollections[0]?.id),

            data: {
              series_details: [...allCollections[0]?.series, savedSeries.id],
            },
          },
        });
        handleSaveModalClose("saved");
      }
      if (!!selectedCollection) {
        setActionStatus("saved");
        await updateSeries({
          variables: {
            id: parseInt(savedSeries?.id),
            data: {
              saved: true,
            },
          },
        });

        await updateCollection({
          variables: {
            id: parseInt(selectedCollection?.id),

            data: {
              series_details: [...selectedCollection?.series, savedSeries.id],
            },
          },
        });
        handleSaveModalClose("saved");
      }
    }
  };
  const handleUpdateSeries = (series, action) => {
    setSavedSeries(series);
    handleSaveModalOpen(action);
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
  const [createCollection] = useMutation(CREATE_COLLECTIONS, {
    client: apolloClient,
    onCompleted: () => {
      handleRefresh();
      setCreateModalOpen(false);
      toast.success("Successfully Create New Collection!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onError: (err) => console.log("error", err),
  });
  const handleCreateNewCollection = async () => {
    await createCollection({
      variables: {
        data: {
          name: collectionName,
        },
      },
    });
  };

  useEffect(() => {
    getCollection();
  }, [fetch]);
  return (
    <>
      <div key={id}>
        <div css={styles.imageCard}>
          <img src={poster} alt="poster" />
          <div>
            <span css={styles.ratingIcon}>
              <AiFillStar size={32} color="#fff" />
            </span>
            <p css={styles.viewRating}>{rating} / 10</p>
            <div>
              <Link href={`/series-details/${slug}`}>
                <button css={styles.viewDetailBtn}>View Detail</button>
              </Link>
              {saved ? (
                <button
                  css={styles.saveBtn}
                  onClick={() => handleUpdateSeries(seriesCard, "unsaved")}
                >
                  Unsave
                </button>
              ) : (
                <button
                  css={styles.saveBtn}
                  onClick={() => handleUpdateSeries(seriesCard, "saved")}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
        <p css={styles.seriesName}>{title}</p>
      </div>
      {modalOpen?.unsaved && (
        <Modal
          isOpen={modalOpen?.unsaved}
          toggle={() => handleSaveModalClose("unsaved")}
          centered
        >
          <ModalHeader toggle={() => handleSaveModalClose("unsaved")}>
            <span style={{ fontSize: "1.5rem" }}>Unsave Series</span>
          </ModalHeader>
          <ModalBody>
            Are you sure you want to unsave this ? It will also remove from your
            collection.
          </ModalBody>
          <ModalFooter>
            <Button
              className="closeBtn w-25"
              css={styles.actionBtn}
              onClick={() => handleSaveModalClose("unsaved")}
            >
              Cancel
            </Button>{" "}
            <Button
              className="registerBtn w-25"
              onClick={handleUnsavedSeries}
              css={styles.actionBtn}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      )}
      {modalOpen?.saved && (
        <Modal
          isOpen={modalOpen?.saved}
          toggle={() => handleSaveModalClose("saved")}
          centered
        >
          <ModalHeader toggle={() => handleSaveModalClose("saved")}>
            <span style={{ fontSize: "1.5rem" }}>Save Series</span>
          </ModalHeader>
          <ModalBody>
            {allCollections.length < 1 ? (
              <span>
                Do you want to save the series : <b>{savedSeries?.title}</b> ?
              </span>
            ) : (
              <>
                {allCollections?.map((collection, index) => (
                  <div
                    className="form-check mb-3"
                    key={collection.id}
                    css={styles.collection}
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      defaultChecked={
                        allCollections[0]?.name == collection.name
                      }
                    />
                    <label className="form-check-label" for="flexRadioDefault1">
                      {collection.name}
                    </label>
                  </div>
                ))}
              </>
            )}
          </ModalBody>
          <ModalFooter className="border-top-0 d-flex justify-content-between">
            <button
              css={styles.createNewBtn}
              onClick={() => setCreateModalOpen(!createModalOpen)}
            >
              <BsPlus size={24} /> Create New Collection
            </button>
            <>
              <Button
                className="closeBtn w-25"
                css={styles.actionBtn}
                onClick={() => handleSaveModalClose("saved")}
              >
                Cancel
              </Button>{" "}
              <Button
                className="registerBtn w-25"
                css={styles.actionBtn}
                onClick={handleSavedSeries}
              >
                Save
              </Button>
            </>
          </ModalFooter>
        </Modal>
      )}
      <Modal
        isOpen={createModalOpen}
        toggle={() => setCreateModalOpen(!createModalOpen)}
        size="sm"
        centered
      >
        <ModalHeader toggle={() => setCreateModalOpen(false)}>
          <span style={{ fontSize: "1rem" }}>Create New Collection</span>
        </ModalHeader>
        <ModalBody>
          <div class="form-group">
            <label>Collection Name</label>
            <input
              type="text"
              class="form-control"
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button
            className="closeBtn"
            css={styles.actionBtn}
            onClick={() => setCreateModalOpen(false)}
          >
            Cancel
          </Button>{" "}
          <Button
            className="registerBtn"
            css={styles.actionBtn}
            onClick={handleCreateNewCollection}
          >
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SeriesCard;
const styles = {
  imageCard: css`
    position: relative;
    width: 200px;
    height: 300px;
    border: 2px solid #fff;
    border-radius: 8px;
    margin-bottom: 1em;
    cursor: pointer;
    filter: drop-shadow(10px 8px 8px rgba(0, 0, 0, 0.4));
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0);
    }
    &:hover {
      &:before {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    &:hover button {
      opacity: 1;
    }

    &:hover {
      border: 2px solid #f4f4f4;
      p,
      span {
        opacity: 1;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  `,
  viewDetailBtn: css`
    border: 2px solid #fff;
    width: 65%;
    padding: 1em;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    border-radius: 8px;
    background: var(--color-btn);
    position: absolute;
    top: 60%;
    left: 50%;

    transform: translate(-50%, -50%);
    opacity: 0;
    &:hover {
      background: var(--color-btn-hover);
    }
  `,
  viewRating: css`
    position: absolute;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 500;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  `,
  ratingIcon: css`
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
  `,
  seriesName: css`
    white-space: nowrap;
    max-width: 200px;
    font-size: 1em;
    color: var(--color-text-primary);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  saveBtn: css`
    border: 2px solid #fff;
    width: 65%;
    padding: 0.5em 1em;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    border-radius: 8px;
    background: var(--color-btn);
    position: absolute;
    top: 80%;
    left: 50%;

    transform: translate(-50%, -50%);
    opacity: 0;
    &:hover {
      background: var(--color-btn-hover);
    }
  `,
  collection: css`
    font-size: 1.2rem;
    cursor: pointer;
    .form-check-input:checked {
      background-color: var(--color-bg-secondary);
      border-color: var(--color-bg-secondary);
      box-shadow: none;
    }
  `,
  actionBtn: css`
    background: var(--color-bg-secondary);
    &:hover {
      background: #45342b;
    }
  `,
  createNewBtn: css`
    border: none;
    padding: 0.3em 0.5em;
    display: flex;
    align-items: center;
    gap: 0.3em;
    border-radius: 12px;
    color: var(--color-bg-secondary);
    background: transparent;
    border: 1.5px solid #3c2a21;
  `,
};
