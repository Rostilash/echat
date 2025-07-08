import React from "react";
import style from "./../styles/MonoGameInfo.module.css";

export const ConfirmModal = ({ currentTurnPlayerId, pending, onConfirm, confirmText, onCancel, price }) => {
  if (!pending) return;

  return (
    <>
      {pending && (
        <div className={style.confirm_modal}>
          <div className={style.modal_window}>
            <div className={style.confirm_window}>
              <p>
                {currentTurnPlayerId === pending?.playerId?.name} Купити {pending?.cell.name} за {price}
                $?
              </p>
              <button onClick={onConfirm}>{confirmText}</button>
              <button onClick={onCancel}>Відмовитись</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
