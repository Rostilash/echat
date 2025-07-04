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
}) => {
  const [rolling, setRolling] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  const handleRollDice = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
      handleMove(currentPlayerIndex);
    }, 600);
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
        currentTurnPlayerId={currentTurnPlayerId}
        onConfirm={confirmPurchaseHandler}
        onCancel={cancelPurchase}
        confirmText={"Купити"}
      />

      {/* pendingBuyout */}
      <ConfirmModal
        currentTurnPlayerId={currentTurnPlayerId}
        pending={pendingBuyout}
        onConfirm={handleConfirmBuyout}
        onCancel={cancelPurchase}
        confirmText={"Викупити"}
      />

      <Dices dice={dice} ifCurrentPlayer={ifCurrentPlayer} rolling={rolling} handleRollDice={handleRollDice} />

      <Logs logs={gameLogs} />
    </div>
  );
};
