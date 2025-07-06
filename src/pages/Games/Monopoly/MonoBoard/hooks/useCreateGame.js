import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../../firebase/config";
import { defaultBoard } from "../../utils/defaultBoard";
import { useAuth } from "../../../../../hooks/useAuth";

export const useCreateGame = () => {
  const { currentUser } = useAuth();

  const fireBaseCreateGame = async (navigate) => {
    const docRef = await addDoc(collection(db, "monogames"), {
      status: "waiting",
      board: defaultBoard,
      players: [],
      logs: [],
      currentPlayerIndex: 0,
      currentTurnPlayerId: currentUser?.id || null,
      gameOver: currentUser?.id,
    });

    navigate(`/games/monopoly/lobby/${docRef.id}`);
  };

  return { fireBaseCreateGame };
};
