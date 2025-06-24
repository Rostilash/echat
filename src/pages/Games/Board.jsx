import React from "react";
import style from "./Game1.module.css";

export const Board = ({ board, onClick, combo, filled }) => {
  return (
    <div className={style.main_board}>
      {board.map((cell, idx) => (
        <div
          key={idx}
          className={`${style.board}
            ${cell !== "" ? style.filled : ""} 
            ${combo.includes(idx) ? style.winnerCell : ""}
            ${filled.includes(idx) ? style.errorCell : ""}
            `}
          onClick={() => onClick(idx)}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};
