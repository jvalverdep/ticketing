import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styles from "./modal.module.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = isOpen ? (
    <div className={styles.StyledModalOverlay}>
      <div className={styles.StyledModal}>
        <div className={styles.StyledModalHeader}>
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <div className={styles.StyledModalTitle}>{title}</div>}
        <div className={styles.StyledModalBody}>{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
