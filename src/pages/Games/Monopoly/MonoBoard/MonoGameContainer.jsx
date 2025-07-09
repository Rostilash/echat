import React from "react";
import style from "./../styles/MonoBoard.module.css";
import { useOutletContext } from "react-router-dom";
import { MonoGameInfo } from "./MonoGameInfo";
import { MonoBoard } from "./Board/MonoBoard";

export const MonoGameContainer = () => {
  const {
    players,
    board,
    currentPlayer,
    handleMove,
    logs,
    dice,
    currentTurnPlayerId,
    currentPlayerIndex,
    upgradeCityRent,
    isRolled,
    statusRolled,
    setStatusRolled,
    gameOver,
    handleRestartGame,
    handleDeleteGame,
    confirmPurchaseHandler,
    continueMoveAfterRefusal,
    handleConfirmBuyout,
    pendingPurchase,
    pendingBuyout,
    auction,
    handlePlaceBid,
    handlePassBid,
  } = useOutletContext();

  const ifcurUser = currentPlayer?.id === currentTurnPlayerId;
  const ifCurrentPlayer = ifcurUser && !isRolled && !gameOver;
  const canDeleteGame = ifcurUser && players[0]?.id === currentTurnPlayerId;

  const cancelPurchase = () => {
    continueMoveAfterRefusal();
  };

  return (
    <div className={style.container}>
      {/* Our board */}
      <MonoBoard board={board} upgradeCityRent={upgradeCityRent} currentPlayer={currentPlayer} ifCurrentPlayer={ifCurrentPlayer} players={players} />

      {/* users info */}
      <MonoGameInfo
        gameOver={gameOver}
        canDeleteGame={canDeleteGame}
        currentTurnPlayerId={currentTurnPlayerId}
        currentPlayerIndex={currentPlayerIndex}
        players={players}
        pendingPurchase={pendingPurchase}
        confirmPurchaseHandler={confirmPurchaseHandler}
        cancelPurchase={cancelPurchase}
        pendingBuyout={pendingBuyout}
        ifCurrentPlayer={ifCurrentPlayer}
        handleMove={handleMove}
        handleDeleteGame={handleDeleteGame}
        handleRestartGame={handleRestartGame}
        handleConfirmBuyout={handleConfirmBuyout}
        logs={logs}
        dice={dice}
        statusRolled={statusRolled}
        setStatusRolled={setStatusRolled}
        auction={auction}
        handlePlaceBid={handlePlaceBid}
        handlePassBid={handlePassBid}
      />
    </div>
  );
};
