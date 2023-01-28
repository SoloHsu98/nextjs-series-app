import React from "react";
import { Spinner } from "reactstrap";
import { css } from "@emotion/react";
const Loading = () => {
  return (
    <div css={styles.stateWrapper}>
      <Spinner style={{ width: "2rem", height: "2rem", color: "#fff" }} />
    </div>
  );
};

export default Loading;
const styles = {
  stateWrapper: css`
    width: 100%;
    height: 57vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  `,
};
