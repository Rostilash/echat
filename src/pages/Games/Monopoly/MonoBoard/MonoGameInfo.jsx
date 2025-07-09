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
  auction,
  handlePlaceBid,
  handlePassBid,
}) => {
  const [isSettings, setIsSettings] = useState(false);
  const [bid, setBid] = useState(0);
  const [pass, setPass] = useState(null);

  const handleRollDice = () => {
    setStatusRolled(true);
    handleMove(currentPlayerIndex);
  };

  const handleChange = (e) => {
    setBid(Number(e.target.value));
  };

  const handleSubmit = (bid) => {
    if (bid > 0) {
      console.log(bid > 0);
      handlePlaceBid(Number(bid));
    }
  };

  const handlePass = () => {
    setPass(true);
    handlePassBid();
    setPass(false);
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
      {/* <ConfirmModal
        pending={pendingPurchase}
        price={pendingPurchase?.cell.price}
        currentTurnPlayerId={currentTurnPlayerId}
        onConfirm={confirmPurchaseHandler}
        onCancel={cancelPurchase}
        confirmText={"Купити"}
      /> */}

      <ConfirmModal isOpen={!!pendingPurchase && playerMoney > cellPrice} onClose={() => setPendingPurchase(null)} title="Придбати майно?">
        <p>
          {pendingPurchase?.cell?.name} коштує {pendingPurchase?.cell?.price}$.
        </p>
        <button onClick={confirmPurchaseHandler}>Купити</button>
        <button onClick={() => cancelPurchase()}>Відмовитись</button>
      </ConfirmModal>

      {/* pendingBuyout */}
      {/* <ConfirmModal
        pending={pendingBuyout}
        price={pendingBuyout?.cell.price * 2}
        currentTurnPlayerId={currentTurnPlayerId}
        onConfirm={handleConfirmBuyout}
        onCancel={cancelPurchase}
        confirmText={"Викупити"}
      /> */}

      <ConfirmModal isOpen={!!pendingBuyout} title="Викупити майно?">
        <p>
          {pendingBuyout?.cell?.name} коштує {pendingBuyout?.cell?.price * 2}$.
        </p>
        <button onClick={handleConfirmBuyout}>Викупити</button>
        <button onClick={() => cancelPurchase()}>Відмовитись</button>
      </ConfirmModal>

      {/* Auction */}
      {/* {pass && ( */}
      <ConfirmModal isOpen={!!auction} onClose={() => {}} title="Аукціон">
        <p>
          Аукціон на {auction?.cell?.name}, початкова ціна {auction?.cell?.price}$
        </p>

        {auction?.cell?.price > players[currentPlayerIndex]?.money ? (
          <p>У вас нажаль не вистачає грошей для Аукціону</p>
        ) : (
          <>
            <p>Ваші дії?</p>
            <p>Купити за {bid}$</p>
            <input
              type="range"
              id="bidRange"
              min={auction?.cell?.price}
              max={players[currentPlayerIndex]?.money}
              step="5"
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
      {/* )} */}
      <Dices dice={dice} ifCurrentPlayer={ifCurrentPlayer} rolling={statusRolled} handleRollDice={handleRollDice} />

      <Logs logs={gameLogs} />
    </div>
  );
};
