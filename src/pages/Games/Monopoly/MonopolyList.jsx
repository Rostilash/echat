import React from "react";
import { useNavigate } from "react-router-dom";

export const MonopolyList = ({ games }) => {
  const navigate = useNavigate();

  const handleJoin = (id) => {
    navigate(`/games/monopoly/lobby/${id}`);
  };

  return (
    <div>
      <h2>Список доступних ігор</h2>
      {games.length === 0 ? (
        <p>Ігор немає. Створи першу!</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              Гра №{game.id.slice(0, 6)} — {game.players.length} гравців
              <button onClick={() => handleJoin(game.id)}>Приєднатися</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
