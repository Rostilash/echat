import React from "react";
import style from "./styles/PlayersInfo.module.css";

export const PlayersInfo = ({ players, currentPlayerId }) => {
  return (
    <div className={style.playersContainer}>
      {players.map((player, index) => {
        const isCurrent = player.id === currentPlayerId;
        return (
          <div key={player.id || index} className={`${style.playerCard} ${isCurrent ? style.active : ""}`}>
            <div className={style.name}>
              {player.name} {isCurrent && "👑"}
            </div>
            <div className={style.money}>💰 {player.money}$</div>
            <div className={style.position}>📍 {player.position}</div>
          </div>
        );
      })}
    </div>
  );
};
