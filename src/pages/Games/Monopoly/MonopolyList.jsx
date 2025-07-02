import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./styles/MonopolyLanding.module.css";

export const MonopolyList = ({ games }) => {
  const navigate = useNavigate();
  const handleJoin = (id) => {
    navigate(`/games/monopoly/lobby/${id}`);
  };

  return (
    <div className={style.game_list}>
      <h2>Список доступних ігор</h2>
      {games.length === 0 ? (
        <p className={style.empty}>Ігор немає. Створи першу!</p>
      ) : (
        <ul className={style.list}>
          {games.map((game) => (
            <li key={game.id} className={style.item}>
              <span>
                Гра №{game.id.slice(0, 6)} — {game.players.length} гравців
              </span>
              {game.players.length > 0 && (
                <button className={style.joinButton} onClick={() => handleJoin(game.id)}>
                  Приєднатися
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
