import React, { useState } from "react";
import style from "./../styles/MonoGameInfo.module.css";
import { ConfirmModal } from "./ConfirmModal";
import { Dices } from "./Dices";
import { Logs } from "./Logs";
import { GameSettings } from "./Gamesettings";
import { PlayersInfo } from "./PlayersInfo";

export const MonoGameInfo = ({
  gameOver,
  canDeleteGame,
  currentTurnPlayerId,
  currentPlayerIndex,
  players,
  pendingPurchase,
  confirmPurchaseHandler,
  cancelPurchase,
  pendingBuyout,
  ifCurrentPlayer,
  handleMove,
  handleDeleteGame,
  handleRestartGame,
  handleConfirmBuyout,
  logs,
  dice,
  statusRolled,
  setStatusRolled,
}) => {
  const [isSettings, setIsSettings] = useState(false);

  const handleRollDice = () => {
    setStatusRolled(true);
    handleMove(currentPlayerIndex);
  };

  const gameLogs = logs.map((log, i) => <p key={i}>{log}</p>);
  const isGameEnd = gameOver && canDeleteGame;

  const options = [
    { ifState: isGameEnd, action: handleDeleteGame, text: "Видалити поточну гру" },
    { ifState: isGameEnd, action: handleRestartGame, text: "Переіграти" },
    { ifState: currentTurnPlayerId, action: () => setIsSettings(false), text: "Закрити" },
  ];

  return (
    <div className={style.userInfo}>
      <button className={style.settingsIcon} onClick={() => setIsSettings((prev) => !prev)} aria-label="Налаштування">
        ⚙️
      </button>
      {isSettings && <GameSettings options={options} />}

      <PlayersInfo currentPlayerId={currentTurnPlayerId} players={players} />

      {/* pendingPurchase */}
      <ConfirmModal
        pending={pendingPurchase}
        price={pendingPurchase?.cell.price}
        currentTurnPlayerId={currentTurnPlayerId}
        onConfirm={confirmPurchaseHandler}
        onCancel={cancelPurchase}
        confirmText={"Купити"}
      />

      {/* pendingBuyout */}
      <ConfirmModal
        pending={pendingBuyout}
        price={pendingBuyout?.cell.price * 2}
        currentTurnPlayerId={currentTurnPlayerId}
        onConfirm={handleConfirmBuyout}
        onCancel={cancelPurchase}
        confirmText={"Викупити"}
      />

      <Dices dice={dice} ifCurrentPlayer={ifCurrentPlayer} rolling={statusRolled} handleRollDice={handleRollDice} />

      <Logs logs={gameLogs} />
    </div>
  );
};
