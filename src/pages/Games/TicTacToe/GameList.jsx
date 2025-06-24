import React from "react";
import style from "./Game1.module.css";

export const GameList = ({ userName, gamesList, isStarted, ownerUid, joinExistingGame, deleteGame }) => {
  return (
    <div className={style.mainDesctop}>
      <ul>
        {!isStarted && (
          <>
            <h2> Доступні ігри</h2>
            {gamesList.map((game) => (
              <li key={game.id} className={style.gameList}>
                {game.playerX === ownerUid && <button onClick={() => deleteGame(game.id)}>Видалити</button>}
                <span>Статус: {game.isStarted ? "В процесі" : "Очікування"}</span>

                <span className={style.inline}>
                  Номер гри: {game.id}
                  {!game.playerX === ownerUid ? (
                    ""
                  ) : (
                    <button className={style.joinButton} onClick={() => joinExistingGame(game.id, userName)}>
                      Приєднатися
                    </button>
                  )}
                </span>
                <span>Гравець X: {game.usernamex ? game.usernamex : "Вільно"} </span>
                <span>Гравець O: {game.usernameo ? game.usernameo : "Вільно"}</span>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};
