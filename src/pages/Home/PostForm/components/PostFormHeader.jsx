import React from "react";
import style from "./PostFormHeader.module.css";

export const PostFormHeader = ({ selectedFilter }) => {
  return (
    <div className={style.top_cart}>
      <div>
        <h3>{selectedFilter ? selectedFilter : "Головна сторінка"}</h3>
      </div>
      <div>
        <span className={style.icon_image}>
          <img src="https://cdn-icons-png.flaticon.com/128/899/899531.png" alt="icon" />
        </span>
      </div>
    </div>
  );
};
