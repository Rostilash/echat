import React from "react";
import style from "./../styles/MonoGameInfo.module.css";

export const ConfirmModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return;

  return (
    <div className={style.confirm_window}>
      <div className={style.modal_window}>
        <div className={style.confirm_modal}>
          <div className={style.userInfo}>
            {title && <h2>{title}</h2>}
            <div className={style.confirm_window}>{children}</div>
            {/* <button onClick={onClose}>Закрити</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
