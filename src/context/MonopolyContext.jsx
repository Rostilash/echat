import React, { useState, useEffect, createContext } from "react";
import { db } from "./../firebase/config";
import { collection, addDoc, deleteDoc, getDoc, doc, updateDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

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
  const [board, setBoard] = useState([
    { id: 0, name: "Старт", type: "start", action: "collect", amount: 200 },

    { id: 1, name: "Бульвар Медитеран", type: "property", color: "", price: 60, rent: 2, owner: null },
    { id: 2, name: "Скриня громади", type: "chest", gift: 500 },
    { id: 3, name: "Балтійський проспект", type: "property", color: "", price: 60, rent: 4, owner: null },
    { id: 4, name: "Податок на прибуток", type: "tax", amount: 200 },

    { id: 5, name: "Залізниця Редінг", type: "railroad", price: 200, rent: 25, owner: null, color: "" },

    { id: 6, name: "Вулиця Орієнтал", type: "property", color: "", price: 100, rent: 6, owner: null },
    { id: 7, name: "Шанс", type: "chance", color: "gold" },
    { id: 8, name: "Вулиця Вермонт", type: "property", color: "", price: 100, rent: 6, owner: null },
    { id: 9, name: "Вулиця Коннектикут", type: "property", color: "", price: 120, rent: 8, owner: null },

    { id: 10, name: "В'язниця / Просто в гостях", type: "jail", color: "red" },

    { id: 11, name: "Площа Сент-Чарльз", type: "property", color: "", price: 140, rent: 10, owner: null },
    { id: 12, name: "Електростанція", type: "utility", price: 150, rentMultiplier: 4, owner: null, color: "" },
    { id: 13, name: "Проспект штату", type: "property", color: "", price: 140, rent: 10, owner: null },
    { id: 14, name: "Вулиця Вірджинія", type: "property", color: "", price: 160, rent: 12, owner: null },

    { id: 15, name: "Залізниця Пенсильванія", type: "railroad", price: 200, rent: 25, owner: null, color: "" },

    { id: 16, name: "Вулиця Сент-Джеймс", type: "property", color: "", price: 180, rent: 14, owner: null },
    { id: 17, name: "Скриня громади", type: "chest", color: "gold" },
    { id: 18, name: "Вулиця Теннессі", type: "property", color: "", price: 180, rent: 14, owner: null },
    { id: 19, name: "Вулиця Нью-Йорк", type: "property", color: "", price: 200, rent: 16, owner: null },

    { id: 20, name: "Безкоштовна стоянка", type: "parking" },

    { id: 21, name: "Вулиця Кентуккі", type: "property", color: "", price: 220, rent: 18, owner: null },
    { id: 22, name: "Шанс", type: "chance", color: "gold" },
    { id: 23, name: "Вулиця Індіана", type: "property", color: "", price: 220, rent: 18, owner: null },
    { id: 24, name: "Вулиця Іллінойс", type: "property", color: "", price: 240, rent: 20, owner: null },

    { id: 25, name: "Залізниця Бен-Авеню", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 26, name: "Вулиця Атлантік", type: "property", color: "", price: 260, rent: 22, owner: null },
    { id: 27, name: "Вулиця Вентнор", type: "property", color: "", price: 260, rent: 22, owner: null },
    { id: 28, name: "Водоканал", type: "utility", price: 150, rentMultiplier: 4, owner: null },
    { id: 29, name: "Вулиця Марвін Гарденс", type: "property", color: "", price: 280, rent: 24, owner: null },

    { id: 30, name: "Іди у в'язницю", type: "go-to-jail", color: "red" },

    { id: 31, name: "Вулиця Пасифік", type: "property", color: "", price: 300, rent: 26, owner: null },
    { id: 32, name: "Вулиця Північна Кароліна", type: "property", color: "", price: 300, rent: 26, owner: null },
    { id: 33, name: "Скриня громади", type: "chest" },
    { id: 34, name: "Вулиця Пенсильванія", type: "property", color: "", price: 320, rent: 28, owner: null },

    { id: 35, name: "Залізниця Шорт-Лайн", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 36, name: "Шанс", type: "chance" },
    { id: 37, name: "Парк-Плейс", type: "property", color: "dark-blue", price: 350, rent: 35, owner: null },
    { id: 38, name: "Розкішний податок", type: "tax", amount: 1000 },
    { id: 39, name: "Бродвей", type: "property", color: "dark-blue", price: 400, rent: 5000, owner: null },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [dice, setDice] = useState([0, 0]);

  const getNextActivePlayerIndex = (players, currentIndex) => {
    const totalPlayers = players.length;
    let nextIndex = (currentIndex + 1) % totalPlayers;
    while (players[nextIndex].isBankrupt) {
      nextIndex = (nextIndex + 1) % totalPlayers;
      if (nextIndex === currentIndex) break;
    }

    return nextIndex;
  };

  const clearPlayerProperties = (player) => {
    const propertiesToClear = [...player.properties];
    setTimeout(() => {
      setBoard((prevBoard) => prevBoard.map((cell) => (propertiesToClear.includes(cell.id) ? { ...cell, owner: null, color: "" } : cell)));
    }, 0);
  };

  useEffect(() => {
    const alivePlayers = players.filter((p) => !p.isBankrupt);

    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      setLogs((prev) => [...prev, `🎉 ${winner.name} переміг з сумою ${winner.money}$!`]);
      clearPlayerProperties(winner);
      setGameOver(true);
      return;
    }

    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer?.isBankrupt) {
      const nextIndex = getNextActivePlayerIndex(players, currentPlayerIndex);
      setCurrentPlayerIndex(nextIndex);
    }

    if (currentPlayer?.inJail) {
      const nextIndex = getNextActivePlayerIndex(players, currentPlayerIndex);
      setCurrentPlayerIndex(nextIndex);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => (player.id === currentPlayer.id ? { ...player, jailTurns: 0, inJail: false } : player))
      );
    }
  }, [players, currentPlayerIndex]);

  const rollDice = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);
    const result = d1 + d2;
    return result;
  };

  const handleMove = () => {
    if (gameOver) return;
    setLogs([]);

    const steps = rollDice();
    if (players.length === 0) {
      console.log("hello");
    }
    setPlayers((prevPlayers) => {
      const currentPlayer = prevPlayers[currentPlayerIndex];

      const player = {
        ...currentPlayer,
        properties: [...currentPlayer.properties],
      };

      let newPosition = (player.position + steps) % board.length;
      const logsBuffer = [];

      // --- Старт ---
      if (player.position + steps >= board.length) {
        player.money += 200;
        logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
      }

      if (currentPlayer.isBankrupt) {
        logsBuffer.push(`${currentPlayer.name} вибув з гри`);
        return prevPlayers;
      }

      player.position = newPosition;
      const landedSquare = board[newPosition];

      // --- Купівля ---
      if (["property", "railroad", "utility"].includes(landedSquare.type) && !landedSquare.owner) {
        if (player.money >= landedSquare.price) {
          const confirmBuy = window.confirm(`${player.name}, хочеш купити ${landedSquare.name} за ${landedSquare.price}$?`);
          if (confirmBuy) {
            player.money -= landedSquare.price;
            player.properties.push(landedSquare.id);

            setBoard((prevBoard) => {
              return prevBoard.map((square, idx) => (idx === newPosition ? { ...square, owner: player.id, color: player.color } : square));
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
        logsBuffer.push(`${player.name} сплатив податок за ${landedSquare.name}  ${landedSquare.amount}$`);

        if (player.money < 0) {
          logsBuffer.push(`${player.name} збанкрутував і вибуває з гри 💸`);

          clearPlayerProperties(player);
          player.isBankrupt = true;
          player.properties = [];
          player.position = null;
        }
      }
      // --- Подарунок ---
      if (landedSquare.type === " chest") {
        player.money += landedSquare.gift;
        logsBuffer.push(`${player.name} отримав подарунок ${landedSquare.gift}$`);
      }
      // --- В’язниця ---
      if (landedSquare.type === "jail") {
        logsBuffer.push(`${player.name} потрапив у в'язницю`);
        player.inJail = true;
        player.jailTurns += 1;
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
            clearPlayerProperties(player);
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

    // Перехід до наступного гравця
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
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
        setPlayers,
        board,
        currentPlayer: players[currentPlayerIndex],
        dice,
        logs,
        handleMove,
        gameOver,
        handleRestartGame,
      }}
    >
      {children}
    </MonopolyContext.Provider>
  );
};
