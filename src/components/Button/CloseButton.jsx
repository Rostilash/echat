import React from "react";
import style from "./CloseButton.module.css";

export const CloseButton = ({ onClose }) => {
  return (
    <span className={style.close_button} onClick={onClose}>
      <img src="https://cdn-icons-png.flaticon.com/128/2976/2976286.png" alt="" />
    </span>
  );
};
