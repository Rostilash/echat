import React, { useContext } from "react";
import { MonopolyContext } from "../../../context/MonopolyContext";
import { MonoBoard } from "./MonoBoard";

export const MonopolyContainer = () => {
  const { board, players } = useContext(MonopolyContext);
  const squareMap = board.reduce((map, square) => {
    map[square.id] = square;
    return map;
  }, {});

  return <MonoBoard board={board} players={players} currentPlayer={players[0]} />;
};
