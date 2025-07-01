import React, { useEffect, useRef } from "react";
import style from "./styles/MonoBoard.module.css";
import { PlayersInfo } from "./PlayersInfo";
import { useOutletContext } from "react-router-dom";

export const MonoBoard = () => {
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
    gameOver,
    handleRestartGame,
    handleDeleteGame,
    confirmPurchaseHandler,
    continueMoveAfterRefusal,
    handleConfirmBuyout,
    pendingPurchase,
    pendingBuyout,
  } = useOutletContext();

  const diceResult = dice[0] + dice[1];
  const bottomRef = useRef(null);

  const ifcurUser = currentPlayer?.id === currentTurnPlayerId;
  const ifCurrentPlayer = ifcurUser && !isRolled && !gameOver;
  const canDeleteGame = ifcurUser && players[0]?.id === currentTurnPlayerId;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleUpgradeCity = (cityId, price, upgradeLevel) => {
    upgradeCityRent(cityId, price, upgradeLevel);
  };

  const cancelPurchase = () => {
    continueMoveAfterRefusal();
  };

  return (
    <div className={style.container}>
      {/* Our bord */}
      <div className={style.board}>
        {board.map((cell, index) => {
          const canBuild = currentPlayer?.buildableCells?.includes(cell.id);

          return (
            <div
              key={cell.id}
              className={`${style.cell} ${canBuild ? style.canBuild : ""}`}
              style={{
                gridArea: `p${cell.id + 1}`,
                backgroundColor: canBuild ? `white` : `${cell.color}`,
                border: canBuild ? `10px solid ${cell.color}` : "none",
              }}
            >
              <strong className={style.number}>
                <p>{cell.id + 1}</p>
              </strong>
              <strong className={style.rent}>{cell.rent ? `$${cell.rent}` : ""}</strong>

              {ifCurrentPlayer && canBuild && (
                <div className={style.canBuildLabel}>
                  <>
                    <span>🏠 Можна купити за {cell.price}</span>
                    <button onClick={() => handleUpgradeCity(cell.id, cell.price, (cell.upgradeLevel = ""))}>Будувати</button>
                  </>
                </div>
              )}

              <div className={players.length > 1 ? style.aLotOfPlayers : ""}>
                {players.map((p, i) =>
                  p.position === cell.id ? (
                    <div key={p.id || i} className={style.token}>
                      {p.isBankrupt && i === 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="currentColor"
                          className={style.player_icons}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                          />
                        </svg>
                      ) : p.token !== "" ? (
                        <p>{p.token}</p>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="currentColor"
                          className={style.player_icons}
                          style={{ color: `${p.color}` }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                          />
                        </svg>
                      )}
                    </div>
                  ) : null
                )}
              </div>
              <span>{cell.name}</span>
            </div>
          );
        })}
      </div>

      {/* users info */}
      <div className={style.userInfo}>
        {!gameOver && canDeleteGame && <button onClick={handleDeleteGame}>Видалити поточну гру</button>}
        {!gameOver && canDeleteGame && <button onClick={handleRestartGame}>Переіграти</button>}

        <span>
          <PlayersInfo currentPlayerId={currentTurnPlayerId} players={players} />
        </span>
        {pendingPurchase && (
          <div className={style.confirm_window}>
            <p>
              {currentTurnPlayerId === pendingPurchase.playerId?.name} Купити {pendingPurchase.cell.name} за {pendingPurchase.cell.price}
              $?
            </p>
            <button onClick={confirmPurchaseHandler}>Купити</button>
            <button onClick={cancelPurchase}>Відмовитись</button>
          </div>
        )}
        {pendingBuyout && (
          <div className="modal">
            <p>
              {players.find((p) => p.id === pendingBuyout.buyerId)?.name}, хочеш викупити {pendingBuyout.cell.name} за {pendingBuyout.price}$?
            </p>
            <button onClick={handleConfirmBuyout}>Викупити</button>
            <button onClick={cancelPurchase}>Відмовитись</button>
          </div>
        )}
        <div className={style.roll}>
          <p>{dice[0] + "🎲 " + dice[1] + "🎲 = " + diceResult + "🎲"} </p>
          {ifCurrentPlayer && <button onClick={() => handleMove(currentPlayerIndex)}>Кинути кубики 🎲</button>}
        </div>

        <span className={style.game_logs}>
          {logs && logs.map((log, i) => <p key={i}>{log}</p>)}
          <span ref={bottomRef} />
        </span>
      </div>
    </div>
  );
};
