import React from "react";
import style from "./Modal.module.css";

export const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <p>{message}</p>
        <div className={style.buttons}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};
