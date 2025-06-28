import React, { useEffect, useRef } from "react";
import style from "./styles/MonoBoard.module.css";
import { PlayersInfo } from "./PlayersInfo";
import { useOutletContext } from "react-router-dom";

export const MonoBoard = () => {
  const {
    players,
    board,
    currentPlayer,
    handleMove,
    logs,
    dice,
    currentTurnPlayerId,
    currentPlayerIndex,
    isRolled,
    gameOver,
    handleRestartGame,
    handleDeleteGame,
  } = useOutletContext();

  const diceResult = dice[0] + dice[1];
  const bottomRef = useRef(null);

  const ifCurrentPlayer = currentPlayer?.id === currentTurnPlayerId && !isRolled && !gameOver;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const canDeleteGame = currentTurnPlayerId === currentPlayer?.id && players[0]?.id === currentTurnPlayerId;
  console.log(players);
  return (
    <div className={style.container}>
      <div className={style.board}>
        {board.map((cell, index) => (
          <div key={cell.id} className={style.cell} style={{ gridArea: `p${cell.id + 1}`, backgroundColor: `${cell.color}` }}>
            <strong className={style.number}>
              <p>{cell.id + 1}</p>
            </strong>
            <strong className={style.rent}>{cell.rent ? `$${cell.rent}` : ""}</strong>

            <div className={players.length > 1 ? style.aLotOfPlayers : ""}>
              {players.map((p, i) =>
                p.position === cell.id ? (
                  <div key={p.id || i} className={style.token}>
                    {p.isBankrupt && i === 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className={style.player_icons}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                        />
                      </svg>
                    ) : p.token !== "" ? (
                      <p>{p.token}</p>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className={style.player_icons}
                        style={{ color: `${p.color}` }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                        />
                      </svg>
                    )}
                  </div>
                ) : null
              )}
            </div>
            <span>{cell.name}</span>
          </div>
        ))}
      </div>
      <div className={style.userInfo}>
        <span>{canDeleteGame && <button onClick={handleDeleteGame}>Видалити поточну гру</button>}</span>

        <span>
          <PlayersInfo currentPlayerId={currentTurnPlayerId} players={players} />
        </span>
        <div className={style.roll}>
          {!gameOver && <button onClick={handleRestartGame}>Переіграти</button>}
          <p>{dice[0] + "🎲 " + dice[1] + "🎲 = " + diceResult + "🎲"} </p>

          {ifCurrentPlayer && <button onClick={() => handleMove(currentPlayerIndex)}>Кинути кубики 🎲</button>}
        </div>

        <span className={style.game_logs}>
          {logs && logs.map((log, i) => <p key={i}>{log}</p>)}
          <span ref={bottomRef} />
        </span>
      </div>
    </div>
  );
};
