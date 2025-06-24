import React, { useState, useEffect, createContext } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, deleteDoc, getDoc, doc, updateDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export const TicTacToeContext = createContext();

export const TicTacToeProvider = ({ children }) => {
  const { currentUser, ownerUid } = useAuth();
  const userName = currentUser?.name;

  const [gamesList, setGamesList] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [game, setGame] = useState({
    playerX: null,
    playerO: null,
    usernamex: null,
    usernameo: null,
    board: Array(9).fill(""),
    currentTurn: "X",
    winner: null,
    isStarted: false,
    ditailsText: "",
  });
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    let previousStarted = false;
    const sound = new Audio("/sounds/zagruzka-novoy-igryi.mp3");
    const unsub = onSnapshot(doc(db, "games", gameId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGame(data);

        if (data.isStarted && !previousStarted) {
          sound.play().catch((e) => console.warn("Помилка відтворення:", e));
        }

        previousStarted = data.isStarted;
      }
    });

    return () => unsub();
  }, [gameId]);

  useEffect(() => {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, orderBy("createdAt", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.winner === "draw" || !data.winner) {
          gamesArray.push({ id: doc.id, ...data });
        }
      });
      setGamesList(gamesArray.slice(0, 10));
    });

    return () => unsubscribe();
  }, []);

  const createGame = async () => {
    const docRef = await addDoc(collection(db, "games"), {
      playerX: ownerUid,
      usernamex: userName,
      usernameo: null,
      playerO: null,
      board: Array(9).fill(""),
      combo: [],
      filled: [],
      currentTurn: "X",
      winner: null,
      createdAt: new Date(),
      isStarted: false,
      ditailsText: "",
    });
    setGameId(docRef.id);
    return docRef.id;
  };

  const updateGame = async (data) => {
    if (!gameId) return;
    await updateDoc(doc(db, "games", gameId), data);
  };

  const joinExistingGame = async (id, name) => {
    setGameId(id);
    setIsGameStarted(true);
    const gameDoc = doc(db, "games", id);
    const gameSnap = await getDoc(gameDoc);

    if (gameSnap.exists()) {
      const gameData = gameSnap.data();

      if (!gameData.playerO && ownerUid !== gameData.playerX) {
        await updateDoc(gameDoc, {
          playerO: ownerUid,
          isStarted: true,
          ditailsText: "Гра почалась",
          usernameo: name,
        });
      }
    }
    setIsGameStarted(false);
  };

  const makeMove = async (newBoard, turn, winner) => {
    await updateGame({ board: newBoard, currentTurn: turn, winner: winner || null });
  };

  const deleteGame = async (id) => {
    await deleteDoc(doc(db, "games", id));
    setGameId(null);
    setGame({ isStarted: false });
  };

  return (
    <TicTacToeContext.Provider
      value={{
        game,
        setGame,
        createGame,
        updateGame,
        makeMove,
        ownerUid,
        gameId,
        joinExistingGame,
        gamesList,
        userName,
        setGameId,
        isGameStarted,
        deleteGame,
      }}
    >
      {children}
    </TicTacToeContext.Provider>
  );
};
