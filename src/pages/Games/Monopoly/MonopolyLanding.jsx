import { useNavigate, useOutletContext } from "react-router-dom";
import { MonopolyList } from "./MonopolyList";
import style from "./styles/MonopolyLanding.module.css";
import { useCreateGame } from "./MonoBoard/hooks/useCreateGame";
import { useLobbyGames } from "./MonoBoard/hooks/useLobbyGames";

export const MonopolyLanding = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {}; // For testing in progress
  const { handleJoin } = outletContext;
  const { fireBaseCreateGame } = useCreateGame();
  const { games, loading } = useLobbyGames();

  const handleCreateGame = async () => {
    await fireBaseCreateGame(navigate);
  };

  return (
    <div className={style.list_block}>
      {/* list from fireBase */}
      <button onClick={handleCreateGame} className={style.create_game}>
        Створити гру
      </button>
      <MonopolyList games={games} handleJoin={handleJoin} />
    </div>
  );
};
2;
