import { FC } from "react";

interface ModalButtonProps {
  children: React.ReactNode;
}

const ModalButtons: FC<ModalButtonProps> = ({ children }) => {
  return <div className="modal-buttons">{children}</div>;
};

export default ModalButtons;
