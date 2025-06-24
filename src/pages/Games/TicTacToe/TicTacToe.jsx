import React, { useContext } from "react";
import style from "./Game1.module.css";
import { checkWinner } from "./сheckWinner";
import { TicTacToeContext } from "../../../context/TicTacToeContext";
import { GameList } from "./GameList";
import { StardetGame } from "./StardetGame";

export const TicTacToe = () => {
  const {
    game,
    setGame,
    gameId,
    setGameId,
    createGame,
    updateGame,
    makeMove,
    ownerUid,
    joinExistingGame,
    gamesList,
    userName,
    isGameStarted,
    deleteGame,
  } = useContext(TicTacToeContext);

  const gameIsCreated = gamesList.some((list) => list.usernamex.includes(userName));

  const handleAddSymbol = async (index) => {
    if (game.board[index] !== "") return;
    if (game.isStarted === false) return;

    const playerSymbol = ownerUid === game.playerX ? "X" : ownerUid === game.playerO ? "O" : "draw";
    if (!playerSymbol || game.currentTurn !== playerSymbol || game.winner) return;

    const newBoard = [...game.board];
    newBoard[index] = playerSymbol;

    const result = checkWinner(newBoard);
    const isDraw = newBoard.every((cell) => cell !== "") && !result?.winner;

    if (result?.winner) {
      const { winner, combo } = result;

      await updateGame({ ditailsText: `Переможець: ${winner === "X" ? `${game.usernamex} (X)!` : `${game.usernameo}(O)!`}`, winner, combo });
      await makeMove(newBoard, null, winner);
      const sound = new Audio("/sounds/zvuk-pobedyi-vyiigryisha.mp3");
      sound.play().catch((e) => console.warn("Помилка відтворення:", e));
      return;
    } else if (isDraw) {
      await updateGame({ ditailsText: "Нічия!", winner: "draw", filled: [0, 1, 2, 3, 4, 5, 6, 7, 8] });
      await makeMove(newBoard, null, "draw");
      return;
    } else if (result?.filled) {
      const updatedFilled = [...(game.filled || []), ...result.filled];
      const uniqueFilled = [...new Set(updatedFilled)];
      await updateGame({ ditailsText: result.ditailsText || "Лінія заповнена", filled: uniqueFilled });
    } else {
      await updateGame({ ditailsText: "" });
    }
    await makeMove(newBoard, playerSymbol === "X" ? "O" : "X", null);
  };

  const handleCreateGame = async () => {
    const id = await createGame();
  };

  const handleQuit = async () => {
    const random = Math.random() > 0.5 ? "X" : "O";
    setGame({ isStarted: false, winner: null });
    await updateGame({
      ditailsText: "Гра закінчена",
      isStarted: false,
      playerO: null,
      usernameo: null,
      currentTurn: random,
      combo: [],
      filled: [],
      winner: null,
      board: Array(9).fill(""),
    });
  };

  const handleRestart = async () => {
    const random = Math.random() > 0.5 ? "X" : "O";
    await updateGame({
      board: Array(9).fill(""),
      winner: null,
      ditailsText: "Давай, цього разу у тебе все вийде!",
      currentTurn: random,
      combo: [],
      filled: [],
    });
  };

  if (isGameStarted) {
    return (
      <div className={style.loader}>
        <h1>Загрузка...</h1>
        <svg fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="7.33" height="7.33">
            <animate id="spinner_oJFS" begin="0;spinner_5T1J.end+0.2s" attributeName="x" dur="0.6s" values="1;4;1" />
            <animate begin="0;spinner_5T1J.end+0.2s" attributeName="y" dur="0.6s" values="1;4;1" />
            <animate begin="0;spinner_5T1J.end+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="0;spinner_5T1J.end+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="8.33" y="1" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="y" dur="0.6s" values="1;4;1" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="1" y="8.33" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="x" dur="0.6s" values="1;4;1" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.1s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="15.66" y="1" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="1;4;1" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="8.33" y="8.33" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="1" y="15.66" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="x" dur="0.6s" values="1;4;1" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.2s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="15.66" y="8.33" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="y" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="8.33" y="15.66" width="7.33" height="7.33">
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="x" dur="0.6s" values="8.33;11.33;8.33" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.3s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
          <rect x="15.66" y="15.66" width="7.33" height="7.33">
            <animate id="spinner_5T1J" begin="spinner_oJFS.begin+0.4s" attributeName="x" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.4s" attributeName="y" dur="0.6s" values="15.66;18.66;15.66" />
            <animate begin="spinner_oJFS.begin+0.4s" attributeName="width" dur="0.6s" values="7.33;1.33;7.33" />
            <animate begin="spinner_oJFS.begin+0.4s" attributeName="height" dur="0.6s" values="7.33;1.33;7.33" />
          </rect>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <GameList
        userName={userName}
        gamesList={gamesList}
        isStarted={game.isStarted}
        ownerUid={ownerUid}
        joinExistingGame={joinExistingGame}
        deleteGame={deleteGame}
      />

      {!gameIsCreated && game.isStarted === false ? (
        <div className={style.perentCreateButton}>
          <button className={style.createButton} onClick={handleCreateGame}>
            Cтворити гру
          </button>
        </div>
      ) : null}

      <StardetGame
        game={game}
        handleRestart={handleRestart}
        handleQuit={handleQuit}
        handleAddSymbol={handleAddSymbol}
        deleteGame={deleteGame}
        ownerUid={ownerUid}
        gameId={gameId}
      />
    </div>
  );
};
