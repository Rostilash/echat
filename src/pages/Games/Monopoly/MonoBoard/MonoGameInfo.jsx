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
  currentPlayer,
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
  auction,
  handlePlaceBid,
  handlePassBid,
}) => {
  const [isSettings, setIsSettings] = useState(false);
  const [bid, setBid] = useState(currentPlayer?.money);
  const [isAuction, setIsAuction] = useState(false);

  const handleRollDice = () => {
    setIsAuction(false);
    setStatusRolled(true);
    handleMove(currentPlayerIndex);
  };

  const handleChange = (e) => {
    setBid(Number(e.target.value));
  };

  const handleSubmit = async (bid) => {
    if (bid > 0 && currentPlayer?.money > bid) {
      setIsAuction(true);
      await handlePlaceBid(Number(bid));
      setBid(0);
    }
  };

  const handlePass = async () => {
    setIsAuction(true);
    await handlePassBid();
  };

  const gameLogs = logs.map((log, i) => <p key={i}>{log}</p>);

  const isGameEnd = gameOver && canDeleteGame;
  const playerMoney = players[currentPlayerIndex]?.money;
  const cellPrice = pendingPurchase?.cell?.price;

  const options = [
    { ifState: isGameEnd, action: handleDeleteGame, text: "Видалити поточну гру" },
    { ifState: !isGameEnd, action: handleRestartGame, text: "Переіграти" },
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
      <ConfirmModal isOpen={!!pendingPurchase && playerMoney > cellPrice} onClose={() => setPendingPurchase(null)} title="Придбати майно?">
        <p>
          {pendingPurchase?.cell?.name} коштує {pendingPurchase?.cell?.price}$.
        </p>
        <button onClick={confirmPurchaseHandler}>Купити</button>
        <button onClick={() => cancelPurchase()}>Відмовитись</button>
      </ConfirmModal>

      {/* pendingBuyout */}
      <ConfirmModal isOpen={!!pendingBuyout} title="Викупити майно?">
        <p>
          {pendingBuyout?.cell?.name} коштує {pendingBuyout?.cell?.price * 2}$.
        </p>
        <button onClick={handleConfirmBuyout}>Викупити</button>
        <button onClick={() => cancelPurchase()}>Відмовитись</button>
      </ConfirmModal>

      {/* Auction */}
      {!isAuction && (
        <ConfirmModal isOpen={!!auction} onClose={() => {}} title="Аукціон">
          <p>
            Аукціон на {auction?.cell?.name}, початкова ціна {auction?.cell?.price}$
          </p>

          {auction?.cell?.price > currentPlayer?.money ? (
            <p>Для участі на аукціоні вам не вистачає {auction?.cell?.price - currentPlayer?.money}$ </p>
          ) : (
            <>
              <p>Ваші дії?</p>
              <p>Купити за {bid}$</p>
              <input
                type="range"
                id="bidRange"
                min={auction?.cell?.price}
                max={currentPlayer?.money}
                step="10"
                value={bid}
                onChange={handleChange}
                style={{ width: "100%" }}
              />

              <button onClick={() => handleSubmit(bid)} disabled={!bid}>
                Зробити ставку
              </button>
            </>
          )}

          <button onClick={() => handlePass()}>Пас</button>
        </ConfirmModal>
      )}

      <Dices dice={dice} ifCurrentPlayer={ifCurrentPlayer} rolling={statusRolled} handleRollDice={handleRollDice} auction={auction} />

      <Logs logs={gameLogs} />
    </div>
  );
};
