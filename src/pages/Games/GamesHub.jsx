import { Link } from "react-router-dom";

export const GamesHub = () => {
  return (
    <div>
      <h2>Оберіть гру:</h2>
      <ul>
        <li>
          <Link to="/games/tictactoe">Хрестики-нулики(TicTacToe)</Link>
        </li>
        <li>
          <Link to="/games/monopoly/list">Монополія(Мonopoly)</Link>
        </li>

        {/* інші ігри */}
      </ul>
    </div>
  );
};
