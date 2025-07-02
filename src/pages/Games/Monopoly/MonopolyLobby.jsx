import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import style from "./styles/MonopolyLobby.module.css";

export const MonopolyLobby = () => {
  const { players, lobbyLoading, isJoined, gameId, handleStartGame, currentPlayer, handleJoinGame } = useOutletContext();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [token, setToken] = useState(null);
  const [customColor, setCustomColor] = useState("#dbffb8");

  const allColors = [customColor, "blue", "red", "yellow", "green", "orange", "pink"];
  const allTokens = [null, "🐱", "🐶", "🐸", "🐰", "🐢", "🐧", "🦊", "🐷", "🐮", "🐔", "🦄", "🐙"];
  const takenColors = players.map((p) => p.color);
  const takenTokens = players.map((p) => p.token);

  const availableColors = allColors.filter((c) => !takenColors?.includes(c));
  const availableTokens = allTokens.filter((t) => !takenTokens?.includes(t));

  useEffect(() => {
    if (!isJoined) {
      if (!color || takenColors?.includes(color)) {
        setColor(availableColors[0] || "");
      }
      if (!token || takenTokens?.includes(token)) {
        setToken(availableTokens[0] || "");
      }
    }
  }, [availableColors, availableTokens, color, token, isJoined, takenColors, takenTokens]);

  if (!lobbyLoading) return <p>Завантаження...</p>;

  return (
    <div className={style.lobby}>
      <h2>Лобі гри #{gameId.slice(0, 6)}...</h2>

      {isJoined ? (
        <>
          <p className={style.waiting}>Очікуємо інших гравців...</p>
          <ul className={style.playerList}>
            {players.map((p) => (
              <li key={p.id} className={style.playerItem}>
                {p.name} — <span style={{ color: p.color }}>{p.color}</span> <span className={style.token}>{p.token}</span>
              </li>
            ))}
          </ul>

          {players[0]?.id === currentPlayer?.id && players.length >= 2 && (
            <button className={style.startButton} onClick={handleStartGame}>
              Почати гру
            </button>
          )}
        </>
      ) : (
        <div className={style.joinForm}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" className={style.input} />

          <select
            value={color}
            onChange={(e) => {
              const selected = e.target.value;
              if (selected === "custom") {
                setColor(customColor);
              } else {
                setColor(selected);
              }
            }}
            className={style.select}
          >
            {availableColors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
            <option value="custom">Кастомний</option>
            {availableColors.length === 0 && <option disabled>Усі кольори зайняті</option>}
          </select>

          {color === customColor && (
            <div className={style.customColorWrapper}>
              <label>
                Обраний колір:
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setColor(e.target.value);
                  }}
                  className={style.colorPicker}
                />
              </label>
              <span className={style.customColorCode}>{customColor}</span>
            </div>
          )}

          <select value={token || ""} onChange={(e) => setToken(e.target.value || null)} className={style.select}>
            <option value="">Без токену</option>
            {availableTokens
              .filter((t) => t !== null)
              .map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>

          <button
            className={style.joinButton}
            onClick={() => handleJoinGame(name, color, token)}
            disabled={!color || !name || availableColors.length === 0 || availableTokens.length === 0}
          >
            Приєднатися
          </button>
        </div>
      )}
    </div>
  );
};
