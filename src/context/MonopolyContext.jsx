import React, { useState, useEffect, createContext } from "react";
import { db } from "./../firebase/config";
import { collection, addDoc, deleteDoc, getDoc, doc, updateDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export const MonopolyContext = createContext();

export const MonopolyProvider = ({ children }) => {
  const { currentUser, ownerUid } = useAuth();
  const [players, setPlayers] = useState([
    {
      id: "p1",
      name: "Player 1",
      position: 1,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
    },
    {
      id: "p2",
      name: "Player 2",
      position: 2,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
    },
    {
      id: "p3",
      name: "Player 3",
      position: 3,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
    },
    {
      id: "p4",
      name: "Player 4",
      position: 4,
      money: 1500,
      properties: [],
      inJail: false,
      jailTurns: 0,
    },
  ]);
  const [board, setBoard] = useState([
    { id: 0, name: "Старт", type: "start", action: "collect", amount: 200 },

    { id: 1, name: "Бульвар Медитеран", type: "property", color: "brown", price: 60, rent: 2, owner: null },
    { id: 2, name: "Скриня громади", type: "chest" },
    { id: 3, name: "Балтійський проспект", type: "property", color: "brown", price: 60, rent: 4, owner: null },
    { id: 4, name: "Податок на прибуток", type: "tax", amount: 200 },

    { id: 5, name: "Залізниця Редінг", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 6, name: "Вулиця Орієнтал", type: "property", color: "light-blue", price: 100, rent: 6, owner: null },
    { id: 7, name: "Шанс", type: "chance" },
    { id: 8, name: "Вулиця Вермонт", type: "property", color: "light-blue", price: 100, rent: 6, owner: null },
    { id: 9, name: "Вулиця Коннектикут", type: "property", color: "light-blue", price: 120, rent: 8, owner: null },

    { id: 10, name: "В'язниця / Просто в гостях", type: "jail" },

    { id: 11, name: "Площа Сент-Чарльз", type: "property", color: "pink", price: 140, rent: 10, owner: null },
    { id: 12, name: "Електростанція", type: "utility", price: 150, rentMultiplier: 4, owner: null },
    { id: 13, name: "Проспект штату", type: "property", color: "pink", price: 140, rent: 10, owner: null },
    { id: 14, name: "Вулиця Вірджинія", type: "property", color: "pink", price: 160, rent: 12, owner: null },

    { id: 15, name: "Залізниця Пенсильванія", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 16, name: "Вулиця Сент-Джеймс", type: "property", color: "orange", price: 180, rent: 14, owner: null },
    { id: 17, name: "Скриня громади", type: "chest" },
    { id: 18, name: "Вулиця Теннессі", type: "property", color: "orange", price: 180, rent: 14, owner: null },
    { id: 19, name: "Вулиця Нью-Йорк", type: "property", color: "orange", price: 200, rent: 16, owner: null },

    { id: 20, name: "Безкоштовна стоянка", type: "parking" },

    { id: 21, name: "Вулиця Кентуккі", type: "property", color: "red", price: 220, rent: 18, owner: null },
    { id: 22, name: "Шанс", type: "chance" },
    { id: 23, name: "Вулиця Індіана", type: "property", color: "red", price: 220, rent: 18, owner: null },
    { id: 24, name: "Вулиця Іллінойс", type: "property", color: "red", price: 240, rent: 20, owner: null },

    { id: 25, name: "Залізниця Бен-Авеню", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 26, name: "Вулиця Атлантік", type: "property", color: "yellow", price: 260, rent: 22, owner: null },
    { id: 27, name: "Вулиця Вентнор", type: "property", color: "yellow", price: 260, rent: 22, owner: null },
    { id: 28, name: "Водоканал", type: "utility", price: 150, rentMultiplier: 4, owner: null },
    { id: 29, name: "Вулиця Марвін Гарденс", type: "property", color: "yellow", price: 280, rent: 24, owner: null },

    { id: 30, name: "Іди у в'язницю", type: "go-to-jail" },

    { id: 31, name: "Вулиця Пасифік", type: "property", color: "green", price: 300, rent: 26, owner: null },
    { id: 32, name: "Вулиця Північна Кароліна", type: "property", color: "green", price: 300, rent: 26, owner: null },
    { id: 33, name: "Скриня громади", type: "chest" },
    { id: 34, name: "Вулиця Пенсильванія", type: "property", color: "green", price: 320, rent: 28, owner: null },

    { id: 35, name: "Залізниця Шорт-Лайн", type: "railroad", price: 200, rent: 25, owner: null },

    { id: 36, name: "Шанс", type: "chance" },
    { id: 37, name: "Парк-Плейс", type: "property", color: "dark-blue", price: 350, rent: 35, owner: null },
    { id: 38, name: "Розкішний податок", type: "tax", amount: 100 },
    { id: 39, name: "Бродвей", type: "property", color: "dark-blue", price: 400, rent: 50, owner: null },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [dice, setDice] = useState([1, 1]);

  const rollDice = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);
  };

  return (
    <MonopolyContext.Provider
      value={{
        players,
        board,
        currentPlayer: players[currentPlayerIndex],
        rollDice,
        dice,
        logs,
      }}
    >
      {children}
    </MonopolyContext.Provider>
  );
};
