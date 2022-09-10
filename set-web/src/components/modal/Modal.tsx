import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import Button from "../button/Button";
import "./Modal.scss";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (newState?: boolean) => {
    if (newState !== undefined) setIsOpen(newState);
    else setIsOpen(!isOpen);
  };

  return { isOpen, toggle };
};

interface ModalProps {
  isOpen: boolean;
  toggle: (newState?: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: FC<ModalProps> = ({ children, isOpen, toggle, title }) => {
  useEffect(() => {
    // on esc key press
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [toggle]);

  // if clickedon overlay, close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) toggle(false);
  };

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isOpen ? "opened" : ""}`} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <Button onClick={() => toggle(false)} variant="text" leftIcon={FiX} color="danger" />
        </div>
        <div className="modal-body">
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </div>,
    document.getElementsByClassName("app")[0]
  );
};

export default Modal;
