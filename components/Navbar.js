import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useUser } from "@auth0/nextjs-auth0";
import { BsFillHeartFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Savedbar from "./Savedbar";
import UserMenuItem from "./UserMenuItem";
import { useStoreContext } from "../lib/context";
const NavBar = () => {
  const { showSavedItems, setShowSavedItems } = useStoreContext();
  const { user, error, isLoading } = useUser();
  return (
    <div css={styles.navContainer}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 css={styles.header}>WuXia Series</h1>
        <div css={styles.navItems}>
          {/* <div css={styles.searchContainer}>
            <form>
              <input
                type="text"
                css={styles.searchInput}
                placeholder="Quick Search"
              />
              <AiOutlineSearch css={styles.searchIcon} />
            </form>
          </div> */}
          <div css={styles.navLinks}>
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/trending">Trending</Link>
            </li>
            <li>
              <Link href="/popular">Popular</Link>
            </li>
            <li>
              <Link href="/ongoing">Ongoing</Link>
            </li>
            <li>
              <Link href="/upcoming">Upcoming</Link>
            </li>
            <li>
              <Link href="/browse-series">Browse Series</Link>
            </li>
            {user && (
              <li
                onClick={() => setShowSavedItems(true)}
                style={{ position: "relative" }}
              >
                My Favourites <BsFillHeartFill />
              </li>
            )}

            <AnimatePresence>
              {" "}
              {showSavedItems ? <Savedbar /> : null}
            </AnimatePresence>
          </div>
        </div>
        <UserMenuItem />
        {/* <button css={styles.signInBtn}>Sign In</button> */}
      </div>
    </div>
  );
};

export default NavBar;
const styles = {
  navContainer: css`
    width: 100%;
    padding: 1em 2em;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  `,
  header: css`
    font-size: 1.25em;
  `,
  navItems: css`
    display: flex;
    gap: 3em;
  `,
  searchContainer: css`
    position: relative;
  `,
  searchInput: css`
    padding: 0.3em 1em;
    border: none;
    border-radius: 22px;
    color: #474e68;
    font-weight: 500;
    &:focus {
      outline: none;
      border: 1px solid #fff;
    }
  `,
  searchIcon: css`
    position: absolute;
    right: 18px;
    top: 8px;
    color: #474e68;
  `,
  navLinks: css`
    display: flex;
    list-style: none;
    gap: 3em;
    font-weight: 500;

    li {
      cursor: pointer;
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease 0s;

      &:hover {
        transform: translateY(-3px);
      }
      a {
        color: var(--color-text-primary);
        text-decoration: none;
        &:hover {
          text-decoration: none;
          border-bottom: 1px solid var(--color-text-primary);
          box-shadow: 0 4px 8px -8px #fff;
        }
      }
    }
  `,
  signInBtn: css`
    align-self: flex-start;
    padding: 0.3em 2em;
    border: 1px solid #fff;
    background-color: transparent;
    color: var(--color-text-primary);
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      transform: translateY(-3px);
    }
    &:focus {
      outline: none;
    }
  `,
};
