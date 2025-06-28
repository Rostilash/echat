import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./../firebase/config";
import { collection, addDoc, where, getDoc, doc, updateDoc, deleteDoc, onSnapshot, query, arrayUnion } from "firebase/firestore";
import { getNextActivePlayerIndex } from "./../pages/Games/Monopoly/utils/getNextActivePlayerIndex";
import { clearPlayerProperties } from "./../pages/Games/Monopoly/utils/clearPlayerProperties";
import { movePlayerStepByStep } from "./../pages/Games/Monopoly/utils/movePlayerStepByStep";
import { defaultBoard } from "../pages/Games/Monopoly/utils/defaultBoard";
import { useAuth } from "../hooks/useAuth";

export const MonopolyContext = createContext();

export const MonopolyProvider = ({ children, gameId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  // list of games
  const [games, setGames] = useState([]);
  const [board, setBoard] = useState(defaultBoard);
  const [logs, setLogs] = useState([]);
  const [dice, setDice] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);
  const [lobbyLoading, setLobbyLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isRolled, setIsRolled] = useState(false);
  const [status, setStatus] = useState(null);

  console.log(status);

  useEffect(() => {
    let isProcessing = false;

    const handleTurnState = async () => {
      if (isProcessing || status === "waiting") return;
      isProcessing = true;

      const alivePlayers = players.filter((p) => !p.isBankrupt);
      if (alivePlayers.length === 1 && !gameOver) {
        const winner = alivePlayers[0];
        const updatedLogs = [...logs, `🎉 ${winner.name} переміг з сумою ${winner.money}$!`];
        setLogs(updatedLogs);
        clearPlayerProperties(winner, setBoard);
        await updateDoc(doc(db, "monogames", gameId), {
          status: "ended",
          logs: updatedLogs,
        });
        setGameOver(true);
        return;
      }

      const currentPlayer = players[currentPlayerIndex];
      if (!currentPlayer) return;

      if (currentPlayer.isBankrupt || currentPlayer.inJail) {
        let updatedPlayers = [...players];
        const updatedLogs = [...logs];

        if (currentPlayer.inJail) {
          const playerIndex = updatedPlayers.findIndex((p) => p.id === currentPlayer.id);
          if (playerIndex !== -1) {
            const jailTurnsLeft = updatedPlayers[playerIndex].jailTurns;

            if (jailTurnsLeft > 1) {
              updatedPlayers[playerIndex].jailTurns -= 1;
              updatedLogs.push(`${currentPlayer.name} ще ${jailTurnsLeft - 1} хід(ів) y в'язниці`);
            } else {
              updatedPlayers[playerIndex].jailTurns = 0;
              updatedPlayers[playerIndex].inJail = false;
              updatedLogs.push(`${currentPlayer.name} в наступному ході вийде з в'язниці`);
            }

            const nextIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
            const nextPlayerId = updatedPlayers[nextIndex]?.id || null;

            setPlayers(updatedPlayers);
            setLogs(updatedLogs);
            setCurrentPlayerIndex(nextIndex);
            setCurrentTurnPlayerId(nextPlayerId);

            await updateDoc(doc(db, "monogames", gameId), {
              players: updatedPlayers,
              currentPlayerIndex: nextIndex,
              currentTurnPlayerId: nextPlayerId,
              logs: updatedLogs,
            });
          }
        }
      }

      isProcessing = false;
    };

    handleTurnState();
  }, [status, currentPlayerIndex]);

  // 🔁 Listen game onSnapshot, if status === started then all players will navigate to board id from params
  useEffect(() => {
    if (!gameId) return;
    setIsRolled(true);
    const unsub = onSnapshot(doc(db, "monogames", gameId), (docSnap) => {
      if (!docSnap.exists()) {
        navigate(`/games/monopoly/list`);
      }
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLobbyLoading(true);
        setLogs(data.logs);
        setPlayers(data.players);
        setBoard(data.board);
        setCurrentPlayerIndex(data.currentPlayerIndex);
        setCurrentTurnPlayerId(data.currentTurnPlayerId);
        setStatus(data.status);

        if (data.status === "started") {
          navigate(`/games/monopoly/board/${gameId}`);
        }

        // Якщо гравець вже є
        if (data.players.some((p) => p.id === currentUser?.id)) {
          setIsJoined(true);
        }
      }
      setIsRolled(false);
    });

    setLobbyLoading(false);
    return () => unsub();
  }, [gameId, currentUser?.id, navigate, status]);

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

  const updateRailroadRents = (playerId, board) => {
    const railroadIds = board.filter((cell) => cell.type === "railroad" && cell.owner === playerId).map((cell) => cell.id);

    const newRent = {
      1: 25,
      2: 50,
      3: 100,
      4: 200,
    }[railroadIds.length];

    return board.map((cell) => {
      if (cell.type === "railroad" && cell.owner === playerId) {
        return { ...cell, rent: newRent };
      }
      return cell;
    });
  };

  const rollDice = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);

    // need to update this later
    if (d1 === d2) {
      setLogs((prev) => [...prev, `Ти отримав два однакові числа `]);
    }
    const result = d1 + d2;
    return result;
  };

  const handleMove = async (id) => {
    if (status !== "started") return;

    setIsRolled(true);
    const steps = rollDice();
    // const steps = 20;
    const currentPlayer = players[id];

    if (!currentPlayer || currentPlayer.isBankrupt) return;
    const currentPosition = currentPlayer.position;
    let newPosition = (currentPosition + steps) % board.length;
    let logsBuffer = [];
    let updatedBoard = [...board];
    let updatedPlayers = [...players];

    await movePlayerStepByStep(currentPlayerIndex, steps, setPlayers, board);

    let player = { ...currentPlayer };

    if (currentPosition + steps >= board.length) {
      player.money += 200;
      logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
    }

    let landedSquare = updatedBoard[newPosition];

    let finalPosition = newPosition;
    // -- chance --
    if (landedSquare.type === "chance") {
      const bonusSteps = rollDice();
      finalPosition = (newPosition + bonusSteps) % board.length;

      await movePlayerStepByStep(currentPlayerIndex, bonusSteps, setPlayers, board);

      logsBuffer.push(
        `${player.name} потрапив на поле "${landedSquare.name}".  ${steps + 1} + ${bonusSteps}(бонус) ходів і опинився на ${
          finalPosition + 1
        } клітинці`
      );

      landedSquare = updatedBoard[finalPosition];
    }

    player.position = finalPosition;

    // -- jail ---
    if (landedSquare.type === "go_to_jail" || landedSquare.type === "jail") {
      if (landedSquare.type === "go_to_jail") {
        player.position = 10;
        player.jailTurns = 1;
        logsBuffer.push(`${player.name} відправлений у в'язницю на 1 хід`);
      }
      if (landedSquare.type === "jail") {
        logsBuffer.push(`${player.name} будеш сидіти у в'язниці 2 ходи`);
        player.jailTurns = 2;
      }
      player.inJail = true;
    }

    const safeIndex = finalPosition != null ? finalPosition : newPosition;
    // -- buying --
    if (["property", "railroad", "utility"].includes(landedSquare.type) && !landedSquare.owner) {
      if (player.money >= landedSquare.price) {
        const confirmBuy = window.confirm(`${player.name}, хочеш купити ${landedSquare.name} за ${landedSquare.price}$?`);
        if (confirmBuy) {
          player.money -= landedSquare.price;
          player.properties.push(landedSquare.id);

          updatedBoard[safeIndex] = {
            ...landedSquare,
            owner: player.id,
            color: player.color,
          };

          if (landedSquare.type === "railroad") {
            updatedBoard = await updateRailroadRents(player.id, updatedBoard);
          }
          setBoard(updatedBoard);
          logsBuffer.push(`${player.name} купив ${landedSquare.name}`);
        }
      }
    }

    // -- tax --
    if (landedSquare.type === "tax") {
      player.money -= landedSquare.amount;
      logsBuffer.push(`${player.name} заплатив ${landedSquare.name} ${landedSquare.amount}$`);
    }

    // -- tax_income --
    if (landedSquare.type === "tax_income") {
      player.money = Math.floor(player.money - player.money * 0.1);
      logsBuffer.push(`${player.name} заплатив ${landedSquare.name} ${Math.floor(player.money * 0.1)}$`);
    }

    // -- parking --;
    if (landedSquare.type === "parking") {
      logsBuffer.push(`Дивіться на нього, ${player.name} ще встигає відпочити на курорті...`);
    }

    // -- gift --
    if (landedSquare.type === "chest") {
      player.money += landedSquare.gift;
      logsBuffer.push(`${player.name} отримав ${landedSquare.gift}$ від ${landedSquare.name}`);
    }

    const isFinalPosition = true;
    // -- rent --
    if (isFinalPosition && landedSquare.owner && landedSquare.owner !== player.id) {
      const ownerIndex = players.findIndex((p) => p.id === landedSquare.owner);
      const rent = landedSquare.rent || 25;

      updatedPlayers[ownerIndex].money += rent;
      player.money -= rent;

      logsBuffer.push(`${player.name} заплатив ${rent}$ гравцю ${updatedPlayers[ownerIndex].name} за ${landedSquare.name}`);
    }

    // -- bankrupt --
    if (player.money < 0) {
      logsBuffer.push(`${player.name} збанкрутував 💸`);
      player.isBankrupt = true;
      player.position = null;
      player.properties = [];
      clearPlayerProperties(player, setBoard);
    }

    // Update player in array by using ... spred operator
    updatedPlayers[currentPlayerIndex] = player;

    const nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
    const nextPlayerId = updatedPlayers[nextPlayerIndex]?.id || null;

    // update local State
    setPlayers(updatedPlayers);
    setBoard(updatedBoard);
    setLogs((prev) => [...prev, ...logsBuffer]);
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentTurnPlayerId(nextPlayerId);

    // 🔁 update in Firebase
    await updateDoc(doc(db, "monogames", gameId), {
      players: updatedPlayers,
      board: updatedBoard,
      // while testing
      // logs: [...logsBuffer],
      logs: [...logs, ...logsBuffer],
      currentPlayerIndex: nextPlayerIndex,
      currentTurnPlayerId: nextPlayerId,
    });
    setIsRolled(false);
  };

  const fireBaseCreateGame = async (navigate) => {
    const docRef = await addDoc(collection(db, "monogames"), {
      status: "waiting",
      board: board || defaultBoard,
      players: [],
      logs: [],
      currentPlayerIndex: 0,
      currentTurnPlayerId: currentUser?.id || players[0].id,
      gameOver: currentUser?.id,
    });
    navigate(`/games/monopoly/lobby/${docRef.id}`);
  };

  const handleStartGame = async () => {
    await updateDoc(doc(db, "monogames", gameId), {
      status: "started",
    });

    if (status === "started") {
      navigate(`/games/monopoly/board/${gameId}`);
    }
  };

  const handleJoinGame = async (name, color, token) => {
    if (!currentUser || !name) return;

    if (players.some((p) => p.color === color)) {
      alert("Цей колір вже зайнятий. Оберіть інший.");
      return;
    }

    if (players.some((p) => p.token === token)) {
      alert("Цей токен вже зайнятий. Оберіть інший.");
      return;
    }

    const player = {
      id: currentUser?.id,
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
    await updateDoc(doc(db, "monogames", gameId), {
      players: arrayUnion(player),
    });

    setIsJoined(true);
  };

  const handleRestartGame = async () => {
    const playerState = players.map((player) => ({
      ...player,
      position: 0,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
      isBankrupt: false,
    }));

    setPlayers(playerState);
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

    await updateDoc(doc(db, "monogames", gameId), {
      status: "started",
      board: defaultBoard || board,
      players: playerState,
      logs: [],
      currentPlayerIndex: 0,
      currentTurnPlayerId: currentUser?.id || players[0].id,
      gameOver: currentUser?.id,
    });

    setGameOver(false);
  };

  const handleDeleteGame = async () => {
    await deleteDoc(doc(db, "monogames", gameId));
    navigate(`/games/monopoly/list`);
  };

  return (
    <MonopolyContext.Provider
      value={{
        gameId,
        players,
        games,
        board,
        currentPlayer: currentUser,
        currentTurnPlayerId,
        currentPlayerIndex,
        dice,
        logs,
        gameOver,
        handleMove,
        handleRestartGame,
        handleStartGame,
        handleJoinGame,
        handleDeleteGame,
        fireBaseCreateGame,
        setLogs,
        setPlayers,
        setBoard,
        setCurrentPlayerIndex,
        lobbyLoading,
        isJoined,
        isRolled,
      }}
    >
      {children}
    </MonopolyContext.Provider>
  );
};
