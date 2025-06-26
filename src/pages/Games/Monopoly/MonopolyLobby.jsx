import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

export const MonopolyLobby = ({ currentPlayer }) => {
  const { id } = useParams(); // gameId
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [token, setToken] = useState("🐱");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = async () => {
    const player = {
      id: currentPlayer.id,
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
    console.log(player);
  };

  if (isJoined) return <p>Очікуйте початку гри...</p>;

  return (
    <div>
      <h2>Приєднатися до гри</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" />
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="blue">Синій</option>
        <option value="red">Червоний</option>
        <option value="green">Зелений</option>
      </select>
      <select value={token} onChange={(e) => setToken(e.target.value)}>
        <option value="🐱">🐱</option>
        <option value="🐶">🐶</option>
        <option value="🐸">🐸</option>
      </select>
      <button onClick={handleJoin}>Приєднатися</button>
    </div>
  );
};
