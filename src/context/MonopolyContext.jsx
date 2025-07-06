import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./../firebase/config";
import { collection, addDoc, where, doc, updateDoc, deleteDoc, onSnapshot, query, arrayUnion } from "firebase/firestore";
import { getNextActivePlayerIndex } from "./../pages/Games/Monopoly/utils/getNextActivePlayerIndex";
import { clearPlayerProperties } from "./../pages/Games/Monopoly/utils/clearPlayerProperties";
import { defaultBoard } from "../pages/Games/Monopoly/utils/defaultBoard";
import { useAuth } from "../hooks/useAuth";
import { getWinDefaultCombo } from "./../pages/Games/Monopoly/utils/getWinDefaultCombo";
import { updateRailroadRents } from "../pages/Games/Monopoly/utils/updateRailroadRents";
import { handleMoveLogic } from "./utils/monopoly/handleMoveLogic";

export const MonopolyContext = createContext();

export const MonopolyProvider = ({ children, gameId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // lobby states firebase
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState(null);
  const [lobbyLoading, setLobbyLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // game states firebase
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(defaultBoard);
  const [logs, setLogs] = useState([]);
  const [dice, setDice] = useState([0, 0]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);

  // local states
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [pendingBuyout, setPendingBuyout] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isRolled, setIsRolled] = useState(false);
  const [statusRolled, setStatusRolled] = useState(null);
  const [movement, setMovement] = useState(null);
  const updateMonoDoc = doc(db, "monogames", gameId);

  useEffect(() => {
    const handleTurnState = async () => {
      if (status !== "ingame") return;
      const alivePlayers = players.filter((p) => !p.isBankrupt);

      if (alivePlayers.length === 1 && !gameOver) {
        const winner = alivePlayers[0];
        const updatedLogs = [...logs, `🎉 ${winner.name} переміг з сумою ${winner.money}$!`];
        const clearedBoard = clearPlayerProperties(winner, board);

        await updateDoc(updateMonoDoc, {
          status: "ended",
          board: clearedBoard,
          logs: updatedLogs,
          currentPlayerIndex: 0,
          currentTurnPlayerId: players[0]?.id,
        });
        setGameOver(true);
        return;
      }

      const currentPlayer = players[currentPlayerIndex];
      if (!currentPlayer) return;

      if (currentPlayer.inJail) {
        let updatedPlayers = [...players];
        const updatedLogs = [...logs];

        const playerIndex = updatedPlayers.findIndex((p) => p.id === currentPlayer.id);
        if (playerIndex !== -1) {
          const jailTurnsLeft = updatedPlayers[playerIndex].jailTurns;

          if (currentPlayer.jailTurns >= 1) {
            updatedPlayers[playerIndex].jailTurns -= 1;
            updatedLogs.push(`${currentPlayer.name} ще ${jailTurnsLeft} хід(ів) y в'язниці`);
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

          await updateDoc(updateMonoDoc, {
            players: updatedPlayers,
            currentPlayerIndex: nextIndex,
            currentTurnPlayerId: nextPlayerId,
            logs: updatedLogs,
          });
        }
      }
    };

    handleTurnState();
  }, [status, currentPlayerIndex, players]);

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
        setDice(data.dice);
        setMovement(data.movement);

        if (data.player_status === "rolling") {
          setStatusRolled(true);
        } else {
          setStatusRolled(false);
        }

        if (data.status === "started") {
          navigate(`/games/monopoly/board/${gameId}`);
        }

        if (data.status === "ended") {
          setGameOver(true);
        }

        if (data.players.some((p) => p.id === currentUser?.id)) {
          setIsJoined(true);
        }
        setIsRolled(false);
      }
    });

    return () => unsub();
  }, [gameId, currentUser?.id, navigate, status]);

  // Watching for lobby by onSnapshot
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

  // Player moves step by step
  useEffect(() => {
    if (!movement || movement.phase !== "moving") return;

    const playerIndex = players.findIndex((p) => p.id === currentTurnPlayerId);
    if (playerIndex === -1) return;

    const moveStepByStep = async () => {
      const { start, steps } = movement;
      const finalPosition = (start + steps) % (board.length || 40);

      for (let i = 1; i <= steps; i++) {
        await new Promise((res) => setTimeout(res, 300));

        setPlayers((prev) => {
          const updated = [...prev];
          const targetPlayer = updated.find((p) => p.id === currentTurnPlayerId);
          if (!targetPlayer) return prev;

          const updatedPlayer = {
            ...targetPlayer,
            position: (start + i) % (board.length || 40),
          };

          return updated.map((p) => (p.id === currentTurnPlayerId ? updatedPlayer : p));
        });
      }

      const updatedPlayers = players.map((p) => (p.id === currentTurnPlayerId ? { ...p, position: finalPosition } : p));

      await updateDoc(updateMonoDoc, {
        players: updatedPlayers,
        movement: {
          ...movement,
          phase: "idle",
        },
      });
    };

    moveStepByStep();
  }, [movement?.phase]);

  const rollDice = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);

    // need to update this later
    if (d1 === d2) {
      setLogs((prev) => [...prev, `Ти отримав два однакові числа `]);
    }

    return [d1, d2];
  };

  const handleMove = async (id, setRolling) => {
    await handleMoveLogic({
      currentPlayerIndex: id,
      players,
      board,
      setPlayers,
      setBoard,
      setLogs,
      setCurrentPlayerIndex,
      setCurrentTurnPlayerId,
      setPendingPurchase,
      setPendingBuyout,
      setIsRolled,
      updateMonoDoc,
      status,
      logs,
      setDice,
      setRolling,
      rollDice,
      setStatusRolled,
    });
    setStatusRolled(false);
  };

  const upgradeCityRent = async (cityId, price, upgradeLevel) => {
    const player = players.find((p) => p.id === currentUser.id);

    if (!player) {
      console.warn("Гравець не знайдений");
      return;
    }

    if ((upgradeLevel || 0) >= 5) {
      setLogs([...logs, `Максимальний рівень апгрейду досягнуто`]);
      return;
    }

    if (player.money < price) {
      setLogs([`У вас не виставчає грошей для оновлення`]);
      return;
    }

    const updatedBoard = board.map((cell) => {
      if (cell.id === cityId) {
        return {
          ...cell,
          rent: cell.rent * 3,
          price: cell.price * 2,
          upgradeLevel: (cell.upgradeLevel || 0) + 1,
        };
      }
      return cell;
    });

    const updatedPlayers = players.map((p) => {
      if (p.id === currentUser.id) {
        return { ...p, money: p.money - price };
      }
      return p;
    });

    setBoard(updatedBoard);
    setPlayers(updatedPlayers);

    try {
      await updateDoc(updateMonoDoc, {
        board: updatedBoard,
        players: updatedPlayers,
        logs: [...logs, `Успішне оновлення ${board[cityId]?.name} за ${price}$`],
      });
    } catch (error) {
      if (player.money < price) {
        setLogs([...logs, `У вас не достатньо коштів ${price - player.money} щоб оновити ${board[cityId]?.name}`]);
      }

      if ((upgradeLevel || 0) >= 5) {
        setLogs([...logs, `Максимальний рівень будівлі ${board[cityId]?.name}`]);
      }
    }
  };

  const fireBaseCreateGame = async (navigate) => {
    const docRef = await addDoc(collection(db, "monogames"), {
      status: "waiting",
      board: defaultBoard || board,
      players: [],
      logs: [],
      currentPlayerIndex: 0,
      currentTurnPlayerId: currentUser?.id || players[0].id,
      gameOver: currentUser?.id,
    });
    setIsJoined(true);
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
      buildableCells: [],
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
    setPendingPurchase(null);
    await updateDoc(updateMonoDoc, {
      status: "started",
      board: defaultBoard || board,
      players: playerState,
      logs: [],
      dice: [0, 0],
      movement: {
        bonusSteps: 0,
        start: 0,
        steps: 0,
        target: 0,
        phase: "restart",
      },
      currentPlayerIndex: 0,
      currentTurnPlayerId: currentUser?.id || players[0].id,
      gameOver: currentUser?.id,
      player_status: null,
    });

    setGameOver(false);
  };

  const handleDeleteGame = async () => {
    await deleteDoc(doc(db, "monogames", gameId));
    navigate(`/games/monopoly/list`);
  };

  const confirmPurchaseHandler = async () => {
    if (!pendingPurchase) return;

    const { playerId, cell, boardIndex, logs, dice } = pendingPurchase;
    const updatedPlayers = [...players];
    const updatedBoardCopy = [...board];
    const playerIndex = updatedPlayers.findIndex((p) => p.id === playerId);
    const player = updatedPlayers[playerIndex];

    if (!player || player.money < cell.price) {
      setPendingPurchase(null);
      return;
    }

    player.money -= cell.price;
    player.properties.push(cell.id);
    player.position = boardIndex;

    updatedBoardCopy[boardIndex] = {
      ...cell,
      owner: player.id,
      color: player.color,
    };

    const matchedCombos = getWinDefaultCombo(player.properties);

    if (matchedCombos.length > 0) {
      const previousBuildable = player.buildableCells || [];
      const newBuildable = [...new Set(matchedCombos.flat())];
      const willUpdate = previousBuildable.length < newBuildable.length;

      if (willUpdate) {
        player.buildableCells = newBuildable;
        logs.push([...prev, `У ${player.name} з'явилася монополія!`]);
      }
    }

    let finalBoard = updatedBoardCopy;
    if (cell.type === "railroad") {
      finalBoard = await updateRailroadRents(player.id, updatedBoardCopy);
    }
    setBoard(finalBoard);
    const nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
    const nextPlayerId = updatedPlayers[nextPlayerIndex]?.id || null;

    setPlayers(updatedPlayers);

    await updateDoc(updateMonoDoc, {
      status: "ingame",
      board: finalBoard,
      players: updatedPlayers,
      logs: [...logs, `${player.name} купив ${cell.name} за ${cell.price}`],
      currentPlayerIndex: nextPlayerIndex,
      currentTurnPlayerId: nextPlayerId,
      player_status: null,
      dice: dice,
    });

    setPendingPurchase(null);
  };

  const handleConfirmBuyout = async () => {
    if (!pendingBuyout) return;

    const { buyerId, ownerId, cell, price, boardIndex, dice } = pendingBuyout;

    const updatedPlayers = [...players];
    const updatedBoard = [...board];
    const updatedLogs = [...logs];

    const buyerIndex = updatedPlayers.findIndex((p) => p.id === buyerId);
    const ownerIndex = updatedPlayers.findIndex((p) => p.id === ownerId);

    if (buyerIndex === -1 || ownerIndex === -1) return;

    const buyer = updatedPlayers[buyerIndex];
    const owner = updatedPlayers[ownerIndex];

    if (cell.owner !== buyerId) {
      buyer.money -= cell.rent;
      owner.money += cell.rent;
      updatedLogs.push(`${buyer.name} заплатив за ${cell.name} оренду в ${cell.rent}$`);
    }

    buyer.money -= price;
    owner.money += price;

    owner.properties = owner.properties.filter((id) => id !== cell.id);
    buyer.properties.push(cell.id);

    const matchedCombos = getWinDefaultCombo(buyer.properties);
    const previousBuildable = buyer.buildableCells || [];
    const newBuildable = [...new Set(matchedCombos.flat())];

    buyer.buildableCells = previousBuildable.filter((id) => id !== cell.id);

    if (newBuildable.length > previousBuildable.length) {
      buyer.buildableCells = newBuildable;
      updatedLogs.push(`У ${buyer.name} з'явилася монополія!`);
    }

    let finalBoard = updatedBoard;
    if (cell.type === "railroad") {
      finalBoard = await updateRailroadRents(buyer.id, updatedBoard);
    }

    finalBoard[boardIndex] = {
      ...cell,
      owner: buyer.id,
      color: buyer.color,
    };

    setPlayers(updatedPlayers);
    setBoard(finalBoard);
    setLogs([...updatedLogs, `${buyer.name} викупив ${cell.name} у ${owner.name} за ${price}$`]);
    setPendingBuyout(null);

    const nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
    const nextPlayerId = updatedPlayers[nextPlayerIndex]?.id || null;

    await updateDoc(updateMonoDoc, {
      players: updatedPlayers,
      board: finalBoard,
      currentPlayerIndex: nextPlayerIndex,
      currentTurnPlayerId: nextPlayerId,
      logs: [...updatedLogs, `${buyer.name} викупив ${cell.name} у ${owner.name} за ${price}$`],
      player_status: null,
      dice: dice,
    });
  };

  const continueMoveAfterRefusal = async (updatedPlayers = players, updatedBoard = board, updatedLogs = logs) => {
    const nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
    const nextPlayerId = updatedPlayers[nextPlayerIndex]?.id;

    setPendingPurchase(null);
    setPendingBuyout(null);
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentTurnPlayerId(nextPlayerId);

    setPlayers(updatedPlayers);
    setBoard(updatedBoard);
    setLogs(updatedLogs);

    await updateDoc(updateMonoDoc, {
      players: updatedPlayers,
      board: updatedBoard,
      logs: updatedLogs,
      currentPlayerIndex: nextPlayerIndex,
      currentTurnPlayerId: nextPlayerId,
      player_status: "cancel_parchase",
    });
  };

  const player = players.find((player) => player.id === currentUser.id);

  return (
    <MonopolyContext.Provider
      value={{
        gameId,
        players,
        games,
        board,
        currentPlayer: player,
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
        upgradeCityRent,
        lobbyLoading,
        isJoined,
        isRolled,
        statusRolled,
        setStatusRolled,
        confirmPurchaseHandler,
        continueMoveAfterRefusal,
        handleConfirmBuyout,
        pendingPurchase,
        pendingBuyout,
        setPendingBuyout,
      }}
    >
      {children}
    </MonopolyContext.Provider>
  );
};
