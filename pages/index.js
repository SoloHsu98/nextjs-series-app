import { css } from "@emotion/react";
import PopularSeries from "../components/PopularSeries";
import HeroSection from "../components/HeroSection";
import TrendingSeries from "../components/TrendingSeries";

const Home = () => {
  return (
    <div css={styles.mainContainer}>
      <HeroSection />
      <TrendingSeries />
      <PopularSeries />
    </div>
    // <div>
    //   <HeroSection />
    //   <div css={styles.mainContainer}>
    //     <TrendingSeries />
    //     <PopularSeries />
    //   </div>
    // </div>
  );
};
export default Home;
const styles = {
  mainContainer: css`
    /* width: 100%;
    height: 100%; */
    background-color: var(--color-bg-secondary);
  `,
};
