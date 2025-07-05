import React from "react";
import style from "../styles/Dices.module.css";

export const Dices = ({ dice, ifCurrentPlayer, rolling, handleRollDice }) => {
  const diceImage = [
    "https://cdn-icons-png.flaticon.com/128/12482/12482261.png",
    "https://cdn-icons-png.flaticon.com/128/12482/12482272.png",
    "https://cdn-icons-png.flaticon.com/128/12482/12482283.png",
    "https://cdn-icons-png.flaticon.com/128/12482/12482294.png",
    "https://cdn-icons-png.flaticon.com/128/12482/12482312.png",
    "https://cdn-icons-png.flaticon.com/128/12482/12482318.png",
  ];

  return (
    <div className={style.roll}>
      <div className={style.cubes}>
        <div className={`${style.dice} ${rolling ? style.diceRoll : ""}`}>
          <img src={diceImage[dice[0] - 1] || diceImage[5]} alt="" />
        </div>

        <div className={`${style.dice} ${rolling ? style.diceRoll : ""}`}>
          <img src={diceImage[dice[1] - 1] || diceImage[5]} alt="" />
        </div>
      </div>

      {ifCurrentPlayer && !rolling && <button onClick={handleRollDice}>Кинути кубики 🎲</button>}
    </div>
  );
};
