import React from "react";
import style from "./../styles/MonoGameInfo.module.css";

export const GameSettings = ({ options }) => {
  return (
    <>
      <div className={style.confirm_modal}>
        <div className={style.modal_window}>
          <div className={style.confirm_window}>
            {options.map(
              (option, index) =>
                option.ifState && (
                  <button key={index} onClick={option.action}>
                    {option.text}
                  </button>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
