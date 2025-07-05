export const updateRailroadRents = (playerId, board) => {
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
