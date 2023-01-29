import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, PopoverBody, UncontrolledPopover } from "reactstrap";
import { toast } from "react-toastify";
import { RxMoon } from "react-icons/rx";
import { FaRegSun } from "react-icons/fa";
import { useStoreContext } from "lib/context";

const UserMenuItem = () => {
  const router = useRouter();
  const { theme, setTheme } = useStoreContext();
  const { user, error, isLoading } = useUser();

  if (!user)
    return (
      <div>
        <Link href="api/auth/login">
          <button css={styles.signInBtn}>Login In</button>
        </Link>
      </div>
    );

  const handleLogout = () => {
    router.push("/api/auth/logout");

    toast.success("Successfully Logout !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Button
        id="action-popover"
        className="d-flex gap-2 align-items-center border-0 bg-transparent"
        // onClick={() => router.push("/profile")}
      >
        <img src={user?.picture} alt={user.name} css={styles.userImg} />
        <h3 css={styles.userName}>{user.name}</h3>
      </Button>
      <UncontrolledPopover
        hideArrow
        placement="bottom-start"
        trigger="focus"
        target="action-popover"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: () => [14, 4],
            },
          },
        ]}
      >
        <PopoverBody className="p-0 m-0">
          <div css={styles.settingList}>
            <p className="pt-3">{user.email}</p>
            <p>{user.name}</p>

            <p
              className="d-flex align-items-center"
              onClick={() => setTheme(theme == "light" ? "dark" : "light")}
            >
              Change Theme
              {theme == "light" ? (
                <span className="ms-3">
                  <FaRegSun size={18} />
                </span>
              ) : (
                <span className="ms-3">
                  <RxMoon size={18} />
                </span>
              )}
            </p>

            <p className="pb-3" onClick={handleLogout}>
              Logout
            </p>
          </div>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  );
};

export default UserMenuItem;
const styles = {
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
  userImg: css`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
  `,
  userName: css`
    font-size: 1rem;
    margin-bottom: 0;
    cursor: pointer;
    color: var(--color-text-primary);
  `,
  settingList: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    cursor: pointer;

    p {
      padding: 0.5em 2em;
      width: 100%;
      margin-bottom: 0;
      &:hover {
        background: var(--color-btn-hover);
        color: #fff;
      }
    }
  `,
};
