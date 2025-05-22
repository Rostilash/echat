// ImagePreview.jsx
import React from "react";
import style from "./ImagePreview.module.css";

export const ImagePreview = ({ src, onRemove }) => {
  if (!src) return null;

  return (
    <div className={style.preview_block}>
      <div className={style.preview_content}>
        <img src={src} alt="Preview" className={style.preview_image} />
        <button className={style.remove_button} onClick={onRemove}>
          ✖
        </button>
      </div>
    </div>
  );
};
