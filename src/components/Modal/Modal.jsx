import React from "react";
import style from "./Modal.module.css"; // стилі для модального вікна (створи цей файл або адаптуй під свій проект)

const Modal = ({ message, onConfirm, onCancel }) => {
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

export default Modal;
