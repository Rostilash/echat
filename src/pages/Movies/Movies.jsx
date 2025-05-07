import React from "react";
import style from "./Movies.module.css";

export const Movies = () => {
  return (
    <div className={style.movies}>
      <h1>Фільми</h1>
      <iframe
        width="1200"
        height="600"
        src="https://www.youtube.com/embed/videoseries?list=PLcvhF2Wqh7DNVy1OCUpG3i5lyxyBWhGZ8"
        title="YouTube playlist"
        frameBorder="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
