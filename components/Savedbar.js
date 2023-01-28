"use client";
import React, { Fragment, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { BsPlus, BsChevronDown } from "react-icons/bs";
import { motion } from "framer-motion";
import { TbMoodEmpty } from "react-icons/tb";
import { useMutation } from "@apollo/client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { toast } from "react-toastify";
import { useStoreContext } from "../lib/context";
import apolloClient from "../utils/apolloClient";
import { UPDATE_SERIES_DETAIL } from "../graphql/mutations/series";
import { CREATE_COLLECTIONS } from "graphql/mutations/collection";
const Cart = () => {
  const {
    setShowSavedItems,
    savedItems,
    handleRefresh,
    handleSelectCollection,
    handleDropdownToggle,
    collectionDropdownOpen,
    selectedCollection,
    setSelectedCollection,
    setSelectedId,
    allCollections,
  } = useStoreContext();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [updateSeries] = useMutation(UPDATE_SERIES_DETAIL, {
    client: apolloClient,
    onCompleted: () => {
      handleRefresh();
    },
    onError: (err) => console.log("error", err),
  });

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

  const handleUnsavedSeries = async (id) => {
    await updateSeries({
      variables: {
        id: parseInt(id),
        data: {
          saved: false,
          collections: [],
        },
      },
    });
  };
  const handleCreateNewCollection = async () => {
    await createCollection({
      variables: {
        data: {
          name: collectionName,
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setShowSavedItems(false);
        setSelectedCollection(null);
        setSelectedId(null);
      }}
      css={styles.cardWrapper}
    >
      <motion.div
        layout
        initial={{ x: "50%" }}
        animate={{ x: 0 }}
        exit={{ x: "50%" }}
        transition={{ type: "tween" }}
        onClick={(e) => e.stopPropagation()}
        css={styles.cardStyle}
      >
        <div css={styles.headerWrapper}>
          <h1 css={styles.title}>My Collection</h1>
          <button
            css={styles.createNewBtn}
            onClick={() => setCreateModalOpen(!createModalOpen)}
          >
            <BsPlus size={24} /> Create New Collection
          </button>
        </div>

        <Dropdown
          isOpen={collectionDropdownOpen}
          toggle={handleDropdownToggle}
          css={styles.dropdownRoot}
        >
          <DropdownToggle className="toggle-btn">
            <span className="label">
              {(selectedCollection && selectedCollection) || "All Collection"}
            </span>
            <span className="icon">
              <BsChevronDown />
            </span>
          </DropdownToggle>
          <DropdownMenu
            css={styles.menuStyle}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: () => [0, 12],
                },
              },
            ]}
          >
            <div className="dropdown-body">
              {(allCollections?.length > 0 && (
                <div>
                  <Fragment>
                    <DropdownItem onClick={() => handleSelectCollection(null)}>
                      All Collection
                    </DropdownItem>
                  </Fragment>
                  {allCollections?.map(
                    (item, index) =>
                      item.name !== undefined && (
                        <Fragment key={item?.id}>
                          <DropdownItem
                            onClick={() => handleSelectCollection(item)}
                          >
                            {item.name}
                          </DropdownItem>
                        </Fragment>
                      )
                  )}
                </div>
              )) || (
                <div css={styles.emptyLayout}>
                  <div css={styles.emptyDataView}>
                    <div className="icon-wrapper">
                      <TbMoodEmpty color="#fff" />
                    </div>
                    <span className="heading">No Collections!</span>
                  </div>
                </div>
              )}
            </div>
          </DropdownMenu>
        </Dropdown>

        {savedItems?.length < 1 ? (
          <motion.div
            css={styles.emptyView}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 css={styles.emptyText}> No saved series.</h1>
            <TbMoodEmpty color="#1a120b" size={36} />
          </motion.div>
        ) : (
          savedItems?.map((item, index) => (
            <motion.div
              layout
              key={index}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * index }}
              css={styles.card}
            >
              <img src={item?.poster} alt={item.title} />

              <h3 css={styles.seriesName}>{item?.title}</h3>
              <button
                css={styles.unsavedBtn}
                onClick={() => handleUnsavedSeries(item?.id)}
              >
                Unsave
              </button>
            </motion.div>
          ))
        )}
      </motion.div>
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
    </motion.div>
  );
};

export default Cart;

const styles = {
  cardWrapper: css`
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
  `,
  cardStyle: css`
    width: 40%;
    background: #f1f1f1;
    padding: 2rem 3rem;
    overflow-y: scroll;
    position: relative;
  `,
  emptyView: css`
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 80%;
    z-index: -1;
  `,
  card: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    padding: 1rem 2rem;
    margin: 2rem 0rem;
    img {
      width: 5rem;
      height: 4rem;
      object-fit: cover;
    }
    h3 {
      font-size: 1rem;
      text-overflow: ellipsis;
    }
  `,
  seriesName: css`
    color: #1a120b;
  `,
  unsavedBtn: css`
    border: 1.5px solid rgba(64, 66, 88, 0.77);
    background: none;
    padding: 5px 7px;
    color: #1a120b;
    border-radius: 8px;
  `,
  title: css`
    color: #1a120b;
    font-size: 1.8rem;
  `,
  createNewBtn: css`
    border: none;
    padding: 0.6em 1em;
    display: flex;
    align-items: center;
    gap: 0.3em;
    border-radius: 12px;
    color: #3c2a21;
    background: transparent;
    border: 1.5px solid #3c2a21;
  `,
  headerWrapper: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  emptyText: css`
    color: #3c2a21;
    font-size: 2rem;
  `,
  dropdownRoot: css`
    width: 45%;
    margin-top: 2.5em;

    .dropdown-menu {
      min-width: auto;
      width: 100%;
      color: #3c2a21;
      max-height: 15rem;
      overflow-y: auto;
      font-size: 0.95rem;
      border-radius: 4px;
      overflow: hidden auto;
      border: 1px solid #3c2a21;
      background: #3c2a21;
      padding: 0;
      &::-webkit-scrollbar {
        width: 3px;
        border-radius: 10px;
        background: rgba(85, 70, 61, 0.77);
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: grey;
      }
    }
    .dropdown-item {
      color: #fff;
      padding: 0.75rem 1rem;
      background-color: transparent;
      &:hover {
        background-color: #533f2d;
        color: #fff;
      }
    }
    .toggle-btn {
      width: 100%;
      font-weight: 300;
      font-size: 16px;
      text-align: left;
      padding: 0.3em 1em;
      padding-right: 0.5em;
      border-radius: 6px;
      align-items: center;
      display: inline-flex;
      color: #3c2a21;
      font-weight: 500;
      background-color: transparent;
      border: 1.5px solid #3c2a21;
      .label {
        flex: 1;
        font-size: 16px;
        color: #3c2a21;
      }
      &:hover {
        background-color: transparent;
        color: #3c2a21;
      }
      &:focus {
        box-shadow: none;
      }
    }
  `,
  emptyLayout: css`
    height: 10rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `,

  emptyDataView: css`
    max-width: 10rem;
    text-align: center;
    .heading {
      display: block;
      font-size: 1rem;
      font-weight: 500;
      margin-top: 0.75rem;
      color: #fff;
    }
    .icon-wrapper {
      padding: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #3c2a21;
      svg {
        font-size: 2rem;
        color: grey;
      }
    }
  `,
  actionBtn: css`
    background: #3c2a21;
    &:hover {
      background: #45342b;
    }
  `,
};
