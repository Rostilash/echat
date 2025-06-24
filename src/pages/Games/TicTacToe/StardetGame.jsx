import React from "react";
import style from "./Game1.module.css";
import { Board } from "./Board";
export const StardetGame = ({ game, handleRestart, handleQuit, handleAddSymbol, deleteGame, ownerUid, gameId }) => {
  return (
    <>
      {game.isStarted && (
        <div className={style.game_block}>
          <h2>
            {game.ditailsText}{" "}
            {!game.winner && <span>Зараз ходить: {game.currentTurn === "X" ? game.usernamex + " (X)" : game.usernameo + " (O)"}</span>}
          </h2>

          <div className={style.inline}>
            <p>
              <img src="https://cdn-icons-png.flaticon.com/128/18519/18519479.png" alt="gamer" /> <b>Гравець 1 - X</b>: {game.usernamex}
            </p>
            |
            <p>
              <img src="https://cdn-icons-png.flaticon.com/128/18519/18519479.png" alt="gamer" /> <b>Гравець 2 - O</b>: {game.usernameo}
            </p>
          </div>

          {game.winner && (
            <div className={style.after_game_buttons}>
              <button onClick={handleQuit}>Завершити гру</button>
              <button onClick={handleRestart}>Грати ще</button>
            </div>
          )}

          <Board board={game.board} combo={game.combo || []} filled={game.filled || []} onClick={handleAddSymbol} />

          {game.playerX === ownerUid ? (
            <button className={style.joinButton} onClick={() => deleteGame(gameId)}>
              Видалити поточну гру{" "}
            </button>
          ) : (
            <button className={style.joinButton} onClick={() => handleQuit()}>
              Вийти
            </button>
          )}
        </div>
      )}
    </>
  );
};
