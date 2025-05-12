import style from "./Modal.module.css";
import { Button } from "../Button/Button";

export const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <p>{message}</p>
        <div className={style.buttons}>
          <Button onClick={onConfirm} variant="success">
            Yes
          </Button>
          <Button onClick={onCancel} variant="danger">
            No
          </Button>
        </div>
      </div>
    </div>
  );
};
