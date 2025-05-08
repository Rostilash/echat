import React, { useState } from "react";
import style from "./Rightbar.module.css";

export const FilteredNews = ({ newsBlocks = [], onSelectFilter, visibleBlocks, setVisibleBlocks }) => {
  return (
    <div className={style.news_block}>
      <h2>Що відбувається</h2>

      {/* Put only 3 post items */}
      {newsBlocks.slice(0, visibleBlocks).map((block) => (
        <div key={block.label} className={style.newsItem}>
          <div className={style.newsContent}>
            <div className={style.newsTitles}>
              <p className={style.newsInfoText}>{block.description}</p>
              <p className={style.newsName} onClick={() => onSelectFilter(block.filter)}>
                {block.label}
              </p>
              <p className={style.newsInfoText}>Постів: {block.count}</p>
            </div>
            <div className={style.newsOptions}>
              <span>{block.icon}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Add posts button*/}
      <div className={style.newsItem}>
        {visibleBlocks < newsBlocks.length && (
          <p className={style.newsSeeMore_msg} onClick={() => setVisibleBlocks((prev) => prev + 3)}>
            Показати більше
          </p>
        )}
        {visibleBlocks > 3 && (
          <p className={style.newsSeeMore_msg} onClick={() => setVisibleBlocks((prev) => (prev = 3))}>
            Приховати
          </p>
        )}
      </div>
    </div>
  );
};
