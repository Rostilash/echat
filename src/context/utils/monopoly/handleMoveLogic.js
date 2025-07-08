import { updateDoc } from "firebase/firestore";
import { movePlayerStepByStep } from "../../../pages/Games/Monopoly/utils/movePlayerStepByStep";
import { clearPlayerProperties } from "../../../pages/Games/Monopoly/utils/clearPlayerProperties";
import { getNextActivePlayerIndex } from "../../../pages/Games/Monopoly/utils/getNextActivePlayerIndex";
import { delay } from "./useDelay";

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
  logs,
  rollDice,
}) => {
  const currentPlayer = players[currentPlayerIndex];
  await delay(600);

  if (!currentPlayer || currentPlayer.isBankrupt) return;

  let diceArr = rollDice();
  // const steps = diceArr[0] + diceArr[1];
  const steps = 1;
  let logsBuffer = [];
  let updatedBoard = [...board];
  let updatedPlayers = [...players];
  let player = { ...currentPlayer };

  const start = currentPlayer.position;

  // await movePlayerStepByStep(currentPlayerIndex, steps, setPlayers, board);

  const passedStart = player.position + steps >= board.length;
  if (passedStart) {
    player.money += 200;
    logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
  }

  let newPosition = (player.position + steps) % board.length;
  let landedSquare = updatedBoard[newPosition];
  let finalPosition = newPosition;

  let diceArrChance = rollDice();
  let bonusSteps = 0;

  if (landedSquare.type === "chance") {
    await delay(1000);
    bonusSteps = diceArrChance[0] + diceArrChance[1];
    finalPosition = (newPosition + bonusSteps) % board.length;
    console.log(finalPosition);
    if (finalPosition) {
      player.money += 200;
      logsBuffer.push(`${player.name} отримав 200$ за проходження старту`);
    }

    diceArr = diceArrChance;
    landedSquare = updatedBoard[finalPosition];
    logsBuffer.push(
      `${player.name} потрапив на ${updatedBoard[newPosition].name} і його переность на "${landedSquare.name}" — у вас бонус ${bonusSteps} кроків`
    );
  }

  player.position = finalPosition;
  // Handle square types...
  // await delay(100);
  switch (landedSquare.type) {
    case "go_to_jail":
      player.position = 10;
      player.jailTurns = 1;
      player.inJail = true;
      logsBuffer.push(`${player.name} відправлений у в'язницю на 1 хід`);
      finalPosition = 10;
      break;
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

  if (player.money < 0) {
    logsBuffer.push(`${player.name} збанкрутував 💸`);
    player.isBankrupt = true;
    player.position = null;
    player.properties = [];
    updatedBoard = clearPlayerProperties(player, board);
  }

  await updateDoc(updateMonoDoc, {
    player_status: "rolling",
    dice: diceArr,
    currentTurnPlayerId: player.id,
    movement: {
      start,
      steps,
      bonusSteps: landedSquare.type === "chance" ? bonusSteps : 0,
      target: finalPosition,
      phase: "moving",
    },
  });

  if (landedSquare.owner && landedSquare.owner !== player.id) {
    const ownerIndex = updatedPlayers.findIndex((p) => p.id === landedSquare.owner);
    const rent = landedSquare.rent || 25;
    player.money -= rent;
    updatedPlayers[ownerIndex].money += rent;
    logsBuffer.push(`${player.name} заплатив ${rent}$ гравцю ${updatedPlayers[ownerIndex].name}`);
  }

  await delay(2500);
  if (["property", "railroad", "utility"].includes(landedSquare.type)) {
    if (!landedSquare.owner && player.money >= landedSquare.price) {
      // return(pause game) and throw this for options player
      updatedPlayers[currentPlayerIndex] = player;
      // await updateDoc(updateMonoDoc, {
      //   players: updatedPlayers,
      // });

      setPendingPurchase({
        playerId: player.id,
        cell: landedSquare,
        players: updatedPlayers,
        boardIndex: finalPosition,
        logs: [...logs, ...logsBuffer],
        dice: diceArr,
      });
      return;
    }

    if (landedSquare.owner && player.money >= landedSquare.price && landedSquare.owner !== player.id) {
      const buyoutPrice = landedSquare.price * 2;
      if (player.money >= buyoutPrice) {
        // return(pause game) and throw this for options player
        updatedPlayers[currentPlayerIndex] = player;
        setPlayers(updatedPlayers);

        setPendingBuyout({
          buyerId: player.id,
          ownerId: landedSquare.owner,
          cell: landedSquare,
          price: buyoutPrice,
          boardIndex: finalPosition,
          logs: [...logs, ...logsBuffer],
          dice: diceArr,
        });
        return;
      }
    }
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
    dice: diceArr,
  });

  setIsRolled(false);
};
