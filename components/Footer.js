import { css } from "@emotion/react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { BsFacebook, BsTwitter, BsLinkedin } from "react-icons/bs";
import { RiInstagramFill } from "react-icons/ri";
const Footer = () => {
  return (
    <div css={styles.footerContainer}>
      <div>
        <p css={styles.text}>Contact Us</p>
        <div css={styles.contactInfo}>
          <div className="d-flex align-items-center">
            <MdMarkEmailUnread />
            <span css={styles.contactDetail}>solohsu321@gmail.com</span>
          </div>
          <div className="d-flex align-items-center">
            <FaPhoneSquareAlt />
            <span css={styles.contactDetail}>09-123456789</span>
          </div>
          <div css={styles.socialIcons}>
            <span css={styles.contactDetail}>
              <BsFacebook size={18} />
            </span>
            <span css={styles.contactDetail}>
              <RiInstagramFill size={20} />
            </span>
            <span css={styles.contactDetail}>
              <BsTwitter size={20} />
            </span>
            <span css={styles.contactDetail}>
              <BsLinkedin size={18} />
            </span>
          </div>
        </div>
      </div>
      <div>
        <p css={styles.text}>Help Center</p>
        <p css={styles.text}>Login</p>
      </div>
      <div>
        <p css={styles.text}>About Us</p>
        <p css={styles.text}>Way To Watch</p>
      </div>
    </div>
  );
};

export default Footer;
const styles = {
  footerContainer: css`
    width: 100%;
    padding: 1em 2em;
    padding-bottom: 0px;
    background-color: #3c2a21;
    color: #fff;
    border-top: 1px solid #fff;
    display: flex;
    justify-content: space-between;
  `,
  text: css`
    margin-bottom: 13px;
    font-weight: 500;
  `,
  contactInfo: css`
    display: flex;
    gap: 2em;
  `,
  contactDetail: css`
    margin-left: 8px;
    font-size: 12px;
    font-weight: 500;
  `,
  socialIcons: css`
    display: flex;
    align-items: center;
    gap: 0.5em;
  `,
};
