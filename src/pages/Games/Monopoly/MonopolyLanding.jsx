import { useNavigate, useOutletContext } from "react-router-dom";
import { MonopolyList } from "./MonopolyList";

export const MonopolyLanding = () => {
  const { fireBaseCreateGame, games } = useOutletContext();
  const navigate = useNavigate();
  const handleCreateGame = async () => {
    await fireBaseCreateGame(navigate);
  };
  return (
    <div>
      {/* list from fireBase */}
      <MonopolyList games={games} />
      <button onClick={handleCreateGame}>Створити гру</button>
    </div>
  );
};
2;
