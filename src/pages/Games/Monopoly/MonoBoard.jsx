import React from "react";
import style from "./styles/MonoBoard.module.css";

export const MonoBoard = ({ board, players, currentPlayer }) => {
  const playerLength = players.length > 0;
  const { id, name, money, position } = currentPlayer;
  console.log(currentPlayer);
  return (
    <>
      <div className={style.userInfo}>
        <span>Hello! - {name}</span>
        <span>Your money: {money}$</span>
      </div>

      <div className={style.board}>
        {board.map((square, index) => (
          <div key={square.id} className={style.cell} style={{ gridArea: `p${square.id + 1}` }}>
            <strong className={style.number}>
              {/* {square.id + 1}  */}
              <p>{`p${square.id + 1}`}</p>
            </strong>

            <div className={players.length > 1 ? style.aLotOfPlayers : ""}>
              {players.map((p, i) =>
                p.position === square.id ? (
                  <div key={p.id || i} className={style.token}>
                    {i === 0 ? "👤" : i}
                  </div>
                ) : null
              )}
            </div>
            <span>{square.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};
