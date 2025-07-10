import React from "react";
import style from "../styles/PlayersInfo.module.css";

export const PlayersInfo = ({ players, currentPlayerId }) => {
  return (
    <div className={style.playersContainer}>
      {players.map((player, index) => {
        const isCurrent = player.id === currentPlayerId;
        const isBankrupt = player.isBankrupt;
        const isInJail = player.inJail;
        const isResting = player.position === 20;
        return (
          <div
            key={player.id || index}
            className={`${style.playerCard} ${isCurrent ? style.active : ""}`}
            style={{
              backgroundColor: isCurrent && !isBankrupt ? player.color + "33" : undefined,
              borderColor: player.color,
            }}
          >
            {isBankrupt ? (
              <>
                <div className={style.name}>{player.name}</div>
                <p>💀 Програв</p>
              </>
            ) : (
              <>
                {isInJail && <div className={style.status}>🚓 У в'язниці</div>}
                {isResting && <div className={style.name}>🏖️ Відпочиває</div>}
                <div className={style.token}>{player.token}</div>

                <div className={style.name}>
                  <span>{player.name}</span>
                  {isCurrent && <span>👑</span>}
                </div>

                <div className={style.money}>💰 {player.money}$</div>
                {/* <div className={style.position}>📍 Клітинка {player.position + 1}</div> */}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
