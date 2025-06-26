import React, { useContext } from "react";
import { MonopolyContext } from "../../../context/MonopolyContext";
import { MonoBoard } from "./MonoBoard";
import { MonopolyLobby } from "./MonopolyLobby";

export const MonopolyContainer = () => {
  const { board, players, dice, handleMove, currentPlayer, logs, gameOver, handleRestartGame } = useContext(MonopolyContext);

  if (!currentPlayer) {
    return <MonopolyLobby currentPlayer={currentPlayer} />;
  }
  return (
    <MonoBoard
      board={board}
      players={players}
      currentPlayer={currentPlayer}
      dice={dice}
      handleMove={handleMove}
      logs={logs}
      gameOver={gameOver}
      handleRestartGame={handleRestartGame}
    />
  );
};
