import { css } from "@emotion/react";
import Image from "next/image";
import { useRouter } from "next/router";
import heroImg from "../public/pa.jpeg";
import { useUser } from "@auth0/nextjs-auth0/client";
const HeroSection = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  return (
    <div css={styles.hero}>
      <div css={styles.mask}>
        <Image src={heroImg} alt="hero-image" css={styles.heroImg} />
      </div>
      <div css={styles.content}>
        <p>Watch All Wuxia Series Here</p>
        {!user && (
          <button
            css={styles.getStartedBtn}
            onClick={() => router.push("api/auth/login")}
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
const styles = {
  hero: css`
    height: 100%;
    width: 100%;
  `,
  mask: css`
    width: 100%;
    height: 55vh;
    position: relative;
    &:after {
      content: " ";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #000;
      opacity: 0.5;
    }
  `,
  heroImg: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0px -60px;
  `,
  content: css`
    position: absolute;
    max-width: 520px;
    transform: translate(-50%, -50%);
    top: 30%;
    left: 50%;
    text-align: center;

    p {
      font-size: 2.5rem;
      font-weight: 600;
      color: #fff;
    }
  `,
  getStartedBtn: css`
    margin-top: 1em;
    border: 1px solid #f4f4f4;
    padding: 1em 2em;
    background: #1a120b;
    font-size: 18px;
    color: #fff;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease 0s;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
    &:hover {
      background-color: #3c2a21;
      transform: translateY(-3px);
    }
    &:focus {
      outline: none;
    }
  `,
};
