import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { db } from "../../../firebase/config";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "./../../../hooks/useAuth";

export const MonopolyLobby = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // gameId
  const { setLogs, setPlayers, setBoard, setCurrentPlayerIndex } = useOutletContext();
  const { currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [token, setToken] = useState("🐱");
  const [isJoined, setIsJoined] = useState(false);

  // 🔁 Listen game, if status === started then all players will navigate to board id from params
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "monogames", id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGame(data);
        // future updates
        // setLogs(data.logs);
        // setPlayers(data.players);
        // setBoard(data.board);
        // setCurrentPlayerIndex(data.setCurrentPlayerIndex);

        if (data.status === "started") {
          navigate(`/games/monopoly/board/${id}`);
        }

        // Якщо гравець вже є
        if (data.players.some((p) => p.id === currentUser?.id)) {
          setIsJoined(true);
        }
      }
    });

    return () => unsub();
  }, [id, currentUser?.id, navigate]);

  const handleStartGame = async () => {
    await updateDoc(doc(db, "monogames", id), {
      status: "started",
    });
  };

  const allColors = ["blue", "red", "yellow", "green"];
  const allTokens = ["🐱", "🐶", "🐸", "🐰", "🐢", "🐧", "🦊", "🐷", "🐮", "🐔", "🦄", "🐙"];

  const takenColors = game?.players.map((p) => p.color);
  const takenTokens = game?.players.map((p) => p.token);

  const availableColors = allColors.filter((c) => !takenColors?.includes(c));
  const availableTokens = allTokens.filter((t) => !takenTokens?.includes(t));

  // Перевірка зайнятості кольору і токена
  // if (takenColors?.includes(color)) {
  //   return alert("Цей колір вже зайнятий. Оберіть інший.");
  // }
  // if (takenTokens?.includes(token)) {
  //   return alert("Цей токен вже зайнятий. Оберіть інший.");
  // }

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

  const handleJoin = async () => {
    if (!currentUser || !name) return;

    if (game.players.some((p) => p.color === color)) {
      alert("Цей колір вже зайнятий. Оберіть інший.");
      return;
    }

    if (game.players.some((p) => p.token === token)) {
      alert("Цей токен вже зайнятий. Оберіть інший.");
      return;
    }

    const player = {
      id: currentUser.id,
      name,
      color,
      token,
      money: 1500,
      position: 0,
      isBankrupt: false,
      inJail: false,
      jailTurns: 0,
      properties: [],
    };

    await updateDoc(doc(db, "monogames", id), {
      players: arrayUnion(player),
    });

    setIsJoined(true);
  };

  if (!game) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Лобі гри #{id.slice(0, 6)}...</h2>

      {isJoined ? (
        <>
          <p>Очікуємо інших гравців...</p>
          <ul>
            {game.players.map((p) => (
              <li key={p.id}>
                {p.name} — <span style={{ color: p.color }}>{p.color}</span> {p.token}
              </li>
            ))}
          </ul>

          {game.players[0]?.id === currentUser?.id && game.players.length >= 2 && <button onClick={handleStartGame}>Почати гру</button>}
        </>
      ) : (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" />
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {availableColors.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
            {availableColors.length === 0 && <option disabled>Усі кольори зайняті</option>}
          </select>
          <select value={token} onChange={(e) => setToken(e.target.value)}>
            {availableTokens.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            {availableTokens.length === 0 && <option disabled>Усі токени зайняті</option>}
          </select>
          <button onClick={handleJoin} disabled={!color || !token || !name || availableColors.length === 0 || availableTokens.length === 0}>
            Приєднатися
          </button>
        </div>
      )}
    </div>
  );
};
