// src/pages/Games/Monopoly/logic/handleMove.js

import { updateDoc } from "firebase/firestore";
import { movePlayerStepByStep } from "../../../pages/Games/Monopoly/utils/movePlayerStepByStep";
import { clearPlayerProperties } from "../../../pages/Games/Monopoly/utils/clearPlayerProperties";
import { getNextActivePlayerIndex } from "../../../pages/Games/Monopoly/utils/getNextActivePlayerIndex";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleMoveLogic = async ({
  currentPlayerIndex,
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
  rollDice,
  setRolling,
  setDice,
}) => {
  const currentPlayer = players[currentPlayerIndex];
  await delay(600);
  setRolling(false);
  if (status !== "started" && status !== "ingame") return;
  if (!currentPlayer || currentPlayer.isBankrupt) return;

  const diceArr = rollDice();
  const steps = diceArr[0] + diceArr[1];

  await updateDoc(updateMonoDoc, { player_status: "rolling", dice: diceArr });

  let logsBuffer = [];
  let updatedBoard = [...board];
  let updatedPlayers = [...players];
  let player = { ...currentPlayer };

  await movePlayerStepByStep(currentPlayerIndex, steps, setPlayers, board);

  const passedStart = player.position + steps >= board.length;
  if (passedStart) {
    player.money += 200;
    logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
  }

  let newPosition = (player.position + steps) % board.length;
  let landedSquare = updatedBoard[newPosition];
  let finalPosition = newPosition;

  const diceArrChance = rollDice();
  if (landedSquare.type === "chance") {
    // setRolling(true); //second animation

    await delay(1000);

    // setRolling(false);

    // console.log(diceArrChance);
    // console.log(diceArr);
    // setDice(diceArrChance);

    const bonusSteps = diceArrChance[0] + diceArrChance[1];
    finalPosition = (newPosition + bonusSteps) % board.length;

    // updateDoc(updateMonoDoc, { dice: diceArr });
    await movePlayerStepByStep(currentPlayerIndex, bonusSteps, setPlayers, board);
    landedSquare = updatedBoard[finalPosition];
    logsBuffer.push(
      `${player.name} потрапив на ${updatedBoard[newPosition].name} і його переность на "${landedSquare.name}" — у вас бонус ${bonusSteps} кроків`
    );
  }

  player.position = finalPosition;

  // Handle square types...
  switch (landedSquare.type) {
    case "go_to_jail":
      player.position = 10;
      player.jailTurns = 1;
      player.inJail = true;
      logsBuffer.push(`${player.name} відправлений у в'язницю на 1 хід`);
      break;
    case "jail":
      player.jailTurns = 2;
      player.inJail = true;
      logsBuffer.push(`${player.name} сидить у в'язниці 2 ходи`);
      break;
    case "tax":
      player.money -= landedSquare.amount;
      logsBuffer.push(`${player.name} сплатив ${landedSquare.amount}$ податку`);
      break;
    case "tax_income":
      const incomeTax = Math.floor(player.money * 0.1);
      player.money -= incomeTax;
      logsBuffer.push(`${player.name} заплатив податок ${incomeTax}$`);
      break;
    case "chest":
      player.money += landedSquare.gift;
      logsBuffer.push(`${player.name} отримав подарунок ${landedSquare.gift}$`);
      break;
    case "parking":
      logsBuffer.push(`${player.name} відпочиває на стоянці`);
      break;
  }

  if (landedSquare.owner && landedSquare.owner !== player.id) {
    const ownerIndex = updatedPlayers.findIndex((p) => p.id === landedSquare.owner);
    const rent = landedSquare.rent || 25;
    player.money -= rent;
    updatedPlayers[ownerIndex].money += rent;
    logsBuffer.push(`${player.name} заплатив ${rent}$ гравцю ${updatedPlayers[ownerIndex].name}`);
  }

  if (["property", "railroad", "utility"].includes(landedSquare.type)) {
    if (!landedSquare.owner && player.money >= landedSquare.price) {
      setPendingPurchase({
        playerId: player.id,
        cell: landedSquare,
        boardIndex: finalPosition,
        logs: [...logs, ...logsBuffer],
        dice: diceArrChance,
      });
      setIsRolled(false);
      return;
    }

    if (landedSquare.owner && player.money >= landedSquare.price && landedSquare.owner !== player.id) {
      const buyoutPrice = landedSquare.price * 2;
      if (player.money >= buyoutPrice) {
        setPendingBuyout({
          buyerId: player.id,
          ownerId: landedSquare.owner,
          cell: landedSquare,
          price: buyoutPrice,
          boardIndex: finalPosition,
          logs: [...logs, ...logsBuffer],
          dice: diceArrChance,
        });
        return;
      }
    }
  }

  if (player.money < 0) {
    logsBuffer.push(`${player.name} збанкрутував 💸`);
    player.isBankrupt = true;
    player.position = null;
    player.properties = [];
    updatedBoard = clearPlayerProperties(player, board);
  }

  updatedPlayers[currentPlayerIndex] = player;

  const nextPlayerIndex = getNextActivePlayerIndex(updatedPlayers, currentPlayerIndex);
  const nextPlayerId = updatedPlayers[nextPlayerIndex]?.id;

  setPlayers(updatedPlayers);
  setBoard(updatedBoard);
  setLogs([...logs, ...logsBuffer]);
  setCurrentPlayerIndex(nextPlayerIndex);
  setCurrentTurnPlayerId(nextPlayerId);

  await updateDoc(updateMonoDoc, {
    players: updatedPlayers,
    board: updatedBoard,
    logs: [...logs, ...logsBuffer],
    currentPlayerIndex: nextPlayerIndex,
    currentTurnPlayerId: nextPlayerId,
    player_status: "waiting",
    dice: diceArrChance,
  });

  setIsRolled(false);
};
