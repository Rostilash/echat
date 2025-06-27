import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./../firebase/config";
import { collection, addDoc, where, deleteDoc, getDoc, doc, updateDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { getNextActivePlayerIndex } from "./../pages/Games/Monopoly/utils/getNextActivePlayerIndex";
import { clearPlayerProperties } from "./../pages/Games/Monopoly/utils/clearPlayerProperties";
import { movePlayerStepByStep } from "./../pages/Games/Monopoly/utils/movePlayerStepByStep";
import { defaultBoard } from "../pages/Games/Monopoly/utils/defaultBoard";

export const MonopolyContext = createContext();

export const MonopolyProvider = ({ children }) => {
  const [players, setPlayers] = useState([
    {
      id: "p1",
      name: "Player 1",
      position: 0,
      money: 1500,
      properties: [],
      color: "brown",
      inJail: false,
      jailTurns: 0,
      isBankrupt: false,
    },
    {
      id: "p2",
      name: "Player 2",
      position: 0,
      money: 1500,
      properties: [],
      color: "yellow",
      inJail: false,
      jailTurns: 0,
      isBankrupt: false,
    },
    {
      id: "p3",
      name: "Player 3",
      position: 0,
      money: 1500,
      properties: [],
      color: "green",
      inJail: false,
      jailTurns: 0,
      isBankrupt: false,
    },
    {
      id: "p4",
      name: "Player 4",
      position: 0,
      money: 1500,
      properties: [],
      color: "blue",
      inJail: false,
      jailTurns: 0,
      isBankrupt: false,
    },
  ]);
  // list of games
  const [games, setGames] = useState([]);

  const [board, setBoard] = useState(defaultBoard);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [dice, setDice] = useState([0, 0]);

  useEffect(() => {
    const alivePlayers = players.filter((p) => !p.isBankrupt);
    // if only last player he is a winner
    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      setLogs((prev) => [...prev, `🎉 ${winner.name} переміг з сумою ${winner.money}$!`]);
      clearPlayerProperties(winner, setBoard);
      setGameOver(true);
      return;
    }
    // if current player bankrupt throw next player
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer?.isBankrupt) {
      const nextIndex = getNextActivePlayerIndex(players, currentPlayerIndex);
      setCurrentPlayerIndex(nextIndex);
    }

    // if player in jail
    if (currentPlayer?.inJail) {
      if (currentPlayer.jailTurns > 1) {
        setPlayers((prev) => prev.map((p) => (p.id === currentPlayer.id ? { ...p, jailTurns: p.jailTurns - 1 } : p)));

        setLogs((prev) => [...prev, `${currentPlayer.name} ще ${currentPlayer.jailTurns - 1} хід(ів) у в'язниці`]);
      } else {
        setPlayers((prev) => prev.map((p) => (p.id === currentPlayer.id ? { ...p, jailTurns: 0, inJail: false } : p)));

        setLogs((prev) => [...prev, `${currentPlayer.name} вийшов з в'язниці`]);
      }

      // go to next player
      const nextIndex = getNextActivePlayerIndex(players, currentPlayerIndex);
      setCurrentPlayerIndex(nextIndex);
    }
  }, [players, currentPlayerIndex]);

  // 🔁 Listen game, if status === started then all players will navigate to board id from params
  // useEffect(() => {
  //   const unsub = onSnapshot(doc(db, "monogames", id), (docSnap) => {
  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       setLogs(data.logs);
  //       setPlayers(data.players);
  //       setBoard(data.board);
  //       setCurrentPlayerIndex(data.setCurrentPlayerIndex);

  //       if (data.status === "started") {
  //         navigate(`/games/monopoly/board/${id}`);
  //       }

  //       // Якщо гравець вже є
  //       if (data.players.some((p) => p.id === currentUser?.id)) {
  //         setIsJoined(true);
  //       }
  //     }
  //   });

  //   return () => unsub();
  // }, [id, currentUser?.id, navigate]);

  useEffect(() => {
    const q = query(collection(db, "monogames"), where("status", "==", "waiting"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(list);
    });

    return () => unsub();
  }, []);

  const rollDice = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);

    // need to update this later
    if (d1 === d2) {
      setLogs((prev) => [...prev, `Ти отримав два однакові числа ти везуча шляпа`]);
    }
    const result = d1 + d2;
    return result;
  };

  const handleMove = async () => {
    if (gameOver) return;
    // setLogs([]);

    const steps = rollDice();
    // const steps = 7;

    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isBankrupt) return;
    if (currentPlayerIndex === players[currentPlayerIndex]) return;
    // сopy user data
    const currentPosition = currentPlayer.position;
    const newPosition = (currentPosition + steps) % board.length;

    // --- animate player moves ---
    await movePlayerStepByStep(currentPlayerIndex, steps, setPlayers, board);

    // --- result players cell id ---
    let landedSquare = board[newPosition];
    const logsBuffer = [];

    let stepsFromChance = 0;
    if (landedSquare.type === "chance") {
      stepsFromChance = rollDice();
      // stepsFromChance = 5;
    }

    setPlayers((prevPlayers) => {
      const updatedPlayers2 = [...prevPlayers];
      const player = { ...updatedPlayers2[currentPlayerIndex] };

      if (currentPosition + steps >= board.length) {
        player.money += 200;
        logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
      }
      // ---chance---
      if (landedSquare.type !== "chance") {
        player.position = newPosition;
      }
      let chancePosition = null;
      if (landedSquare.type === "chance") {
        chancePosition = (steps + stepsFromChance) % board.length;

        if (player.position + stepsFromChance >= board.length) {
          player.money += 200;
          logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
        }
        movePlayerStepByStep(currentPlayerIndex, stepsFromChance, setPlayers, board);

        // player.position = chancePosition;
        logsBuffer.push(
          `${player.name} потрапив на поле "${landedSquare.name}". Випало + ${stepsFromChance} бонус і опинився на ${chancePosition + 1} клітинку`
        );

        landedSquare = board[chancePosition];
      }
      if (landedSquare.type === "go_to_jail") {
        player.position = 10;
        landedSquare = board[10];
      }

      // --- Купівля ---
      if (["property", "railroad", "utility"].includes(landedSquare.type) && !landedSquare.owner) {
        if (player.money >= landedSquare.price) {
          const confirmBuy = window.confirm(`${player.name}, хочеш купити ${landedSquare.name} за ${landedSquare.price}$?`);
          if (confirmBuy) {
            player.money -= landedSquare.price;
            player.properties.push(landedSquare.id);
            const finalPosition = chancePosition !== null ? chancePosition : newPosition;

            setBoard((prevBoard) => {
              return prevBoard.map((square, idx) => (idx === finalPosition ? { ...square, owner: player.id, color: player.color } : square));
            });

            logsBuffer.push(`${player.name} купив ${landedSquare.name}`);
          } else {
            logsBuffer.push(`${player.name} відмовився купувати ${landedSquare.name}`);
          }
        }
      }
      // --- Податок ---
      if (landedSquare.type === "tax") {
        player.money -= landedSquare.amount;
        logsBuffer.push(`${player.name} сплатив "${landedSquare.name}" - ${landedSquare.amount}$`);

        if (player.money < 0) {
          logsBuffer.push(`${player.name} збанкрутував і вибуває з гри 💸`);

          clearPlayerProperties(player, setBoard);
          player.isBankrupt = true;
          player.properties = [];
          player.position = null;
        }
      }
      // --- Подарунок ---
      if (landedSquare.type === "chest") {
        player.money += landedSquare.gift;
        logsBuffer.push(`${player.name} потрапив на ${landedSquare.name} та отримав подарунок ${landedSquare.gift}$`);
      }
      // --- В’язниця ---
      if (landedSquare.type === "jail") {
        logsBuffer.push(`${player.name} потрапив у в'язницю`);
        player.inJail = true;
        player.jailTurns += 2;
        landedSquare = board[10];
      }
      // --- Оренда ---
      let updatedPlayers = prevPlayers.map((p) => {
        if (p.id === player.id) {
          return player;
        }

        if (landedSquare.owner === p.id && landedSquare.owner !== player.id) {
          const rent = landedSquare.rent || 25;
          const updatedOwner = { ...p, money: p.money + rent };
          player.money -= rent;

          if (player.money < 0) {
            logsBuffer.push(`${player.name} збанкрутував і вибуває з гри 💸`);
            clearPlayerProperties(player, setBoard);
            player.properties = [];
            player.isBankrupt = true;
            player.position = null;
          }

          logsBuffer.push(
            `${player.name} потрапив на ${landedSquare.name} заплатив оренди гравцю ${p.name} $${p.money} + $${rent} = $${p.money + rent}`
          );
          return updatedOwner;
        }

        return p;
      });

      setLogs((prev) => [...prev, ...logsBuffer]);

      return updatedPlayers;
    });

    // Go to next player
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const fireBaseCreateGame = async (navigate) => {
    const docRef = await addDoc(collection(db, "monogames"), {
      status: "waiting",
      board: board || defaultBoard,
      players: [],
      logs: [],
      currentPlayerIndex: 0,
    });
    navigate(`/lobby/${docRef.uid}`);
  };

  const handleRestartGame = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        position: 0,
        money: 1500,
        properties: [],
        inJail: false,
        jailTurns: 0,
        isBankrupt: false,
      }))
    );

    setBoard((prev) =>
      prev.map((cell) => ({
        ...cell,
        owner: null,
        color: "",
      }))
    );

    setLogs([]);
    setDice([0, 0]);
    setCurrentPlayerIndex(0);
    setGameOver(false);
  };

  return (
    <MonopolyContext.Provider
      value={{
        players,
        games,
        board,
        currentPlayer: players[currentPlayerIndex],
        dice,
        logs,
        gameOver,
        handleMove,
        handleRestartGame,
        fireBaseCreateGame,
        setLogs,
        setPlayers,
        setBoard,
        setCurrentPlayerIndex,
      }}
    >
      {children}
    </MonopolyContext.Provider>
  );
};
