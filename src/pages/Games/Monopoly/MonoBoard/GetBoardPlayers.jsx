import React from "react";
import style from "../styles/BoardPlayers.module.css";

export const GetBoardPlayers = ({ players, cell }) => {
  // const userIcon = (
  //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className={style.player_icons}>
  //     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0" />
  //   </svg>
  // );

  return (
    <div className={players.length > 1 ? style.aLotOfPlayers : ""}>
      {players.map((p, i) =>
        p.position === cell.id ? (
          <div key={p.id || i} className={style.token}>
            {p.isBankrupt && i === 0 ? (
              <p>Dead</p>
            ) : p.token !== "" ? (
              <p>{p.token}</p>
            ) : (
              <div className={style.userIconStyle} style={{ background: `linear-gradient(45deg, ${p.color}, #2b794c99)` }}>
                <span className={style.eye_1}></span>
                <span className={style.eye_2}></span>
                <span className={style.mouse}></span>
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
};
