import React, { useState, useContext } from "react";
import { Board } from "./Board";
import { checkWinner } from "./сheckWinner";
import { GameContext } from "../../context/GameContext";

export const Game1 = () => {
  const { game, createGame, updateGame, makeMove, joinGame, ownerUid, joinExistingGame, gamesList, userName } = useContext(GameContext);
  console.log(game);
  const handleClick = async (index) => {
    if (game.board[index] !== "") return;
    if (game.isStarted === false) return;

    const playerSymbol = ownerUid === game.playerX ? "X" : ownerUid === game.playerO ? "O" : null;
    if (!playerSymbol || game.currentTurn !== playerSymbol || game.winner) return;

    const newBoard = [...game.board];
    newBoard[index] = playerSymbol;

    const winner = checkWinner(newBoard);
    const isDraw = !winner && newBoard.every((cell) => cell !== "");
    console.log(isDraw);
    if (winner) {
      await updateGame({ ditailsText: `Переможець: ${winner === "X" ? "Хрестики" : "Нолики"}` });
    } else if (isDraw) {
      await updateGame({ ditailsText: "Нічия!", isStarted: false });
    } else {
      await updateGame({ ditailsText: "" });
    }

    await makeMove(newBoard, playerSymbol === "X" ? "O" : "X", winner);
  };

  const handleCreateGame = async () => {
    const { playerO, playerX } = game;
    if (playerX === playerX) return;
    // if (playerO && playerX) return;

    const id = await createGame();
    // if (playerX) {
    // } else
    if (!playerO) {
      await joinGame(ownerUid, userName);
      const update = await updateGame({ playerO: ownerUid, ditailsText: "Гра почалась", isStarted: true });
    }
  };

  return (
    <div>
      <div>
        <h2>Доступні ігри</h2>
        <ul>
          {!game.isStarted &&
            gamesList.map((game) => (
              <li key={game.id}>
                Гра ID: {game.id} / Гравець X: {game.usernamex ? game.usernamex : "Вільно"} — Гравець O: {game.usernameo ? game.usernameo : "Вільно"}{" "}
                — Статус: {game.isStarted ? "В процесі" : "Очікування"}
                {!game.playerX === ownerUid ? "" : <button onClick={() => joinExistingGame(game.id, userName)}>Приєднатися</button>}
              </li>
            ))}
        </ul>
      </div>

      {!game.isStarted && <button onClick={handleCreateGame}>Cтворити</button>}
      {game.isStarted && (
        <>
          <p>Гравець 1: {game.usernamex}</p>
          <p>Гравець 2: {game.usernameo}</p>

          <h2>Хрестики Нолики</h2>

          <span>{game.ditailsText}</span>

          {!game.winner && <p>Зараз ходить: {game.currentTurn === "X" ? "Хрестик X" : "Нолик O"}</p>}

          <Board board={game.board} onClick={handleClick} />
        </>
      )}
    </div>
  );
};
