import React from "react";
import { TbMoodEmpty } from "react-icons/tb";
import { css } from "@emotion/react";
const NoResult = () => {
  return (
    <div css={styles.stateWrapper}>
      <div css={styles.emptyView}>
        <div className="icon-wrapper">
          <TbMoodEmpty />
        </div>
        <span className="heading">No Results Found</span>
        <span className="subTitle">
          There is no data related with your search.
        </span>
      </div>
    </div>
  );
};

export default NoResult;
const styles = {
  stateWrapper: css`
    width: 100%;
    height: 57vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `,
  emptyView: css`
    max-width: 16rem;
    text-align: center;
    .heading {
      display: block;
      font-size: 1.25rem;
      font-weight: 500;
      margin-top: 1.25rem;
      color: #fff;
    }
    .subTitle {
      display: inline-block;
      margin-top: 0.5rem;
      line-height: 1.5;
      color: #fff;
    }
    .icon-wrapper {
      padding: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: transparent;
      svg {
        font-size: 4rem;
        color: #fff;
      }
    }
  `,
};
