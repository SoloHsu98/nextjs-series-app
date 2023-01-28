import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { css } from "@emotion/react";

const SuccessModal = ({ open, onClose, title, bodyValue }) => {
  return (
    <Modal
      scrollable
      size="lg"
      centered
      isOpen={open}
      toggle={onClose}
      css={styles.root}
    >
      <ModalHeader className="border-bottom-0 px-4" />
      <ModalBody>
        <div className="d-grid align-items-center justify-content-center">
          <span className="text-center">
            {/* <img
              src={SuccessImg}
              alt="successImage"
              style={{ borderRadius: "50%", width: "150px", height: "150px" }}
            /> */}
          </span>
          <span className="title">{title}</span>
          {bodyValue}
        </div>
        <div className="d-flex align-items-center justify-content-center mt-4 px-3">
          <Button outline className="registerBtn w-25" onClick={onClose}>
            Close
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default SuccessModal;
const styles = {
  root: css`
    width: 420px;
    .title {
      font-size: 20px;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 20px;
      font-weight: bold;
      z-index: 99;
    }
    .text {
      font-size: 14px;
      text-align: center;
      color: black;
    }
  `,
};
