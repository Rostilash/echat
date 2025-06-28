import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export const MonopolyLobby = () => {
  const { players, lobbyLoading, isJoined, gameId, handleStartGame, currentPlayer, handleJoinGame } = useOutletContext();
  // console.log(currentPlayer?.id === players[0]?.id);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [token, setToken] = useState(null);

  const allColors = ["blue", "red", "yellow", "green", "orange", "pink"];
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
    <div>
      <h2>Лобі гри #{gameId.slice(0, 6)}...</h2>

      {isJoined ? (
        <>
          <p>Очікуємо інших гравців...</p>
          <ul>
            {players.map((p) => (
              <li key={p.id}>
                {p.name} — <span style={{ color: p.color }}>{p.color}</span> {p.token}
              </li>
            ))}
          </ul>

          {players[0]?.id === currentPlayer?.id && players.length >= 2 && <button onClick={handleStartGame}>Почати гру</button>}
        </>
      ) : (
        <div>
          {/* name */}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" />
          {/* color */}
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {availableColors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
            <option value="custom">Кастомний</option>
            {availableColors.length === 0 && <option disabled>Усі кольори зайняті</option>}
          </select>
          {color === "custom" && <input type="color" onChange={(e) => setColor(e.target.value)} title="Обери свій колір" />}
          {/* tokens */}
          <select value={token || ""} onChange={(e) => setToken(e.target.value || null)}>
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
