import { useNavigate, useOutletContext } from "react-router-dom";
import { MonopolyList } from "./MonopolyList";
import style from "./styles/MonopolyLanding.module.css";

export const MonopolyLanding = () => {
  const { fireBaseCreateGame, games, handleJoin } = useOutletContext();
  const navigate = useNavigate();
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
