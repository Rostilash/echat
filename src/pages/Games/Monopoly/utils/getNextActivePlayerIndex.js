export const getNextActivePlayerIndex = (players, currentIndex) => {
  const totalPlayers = players.length;
  let nextIndex = (currentIndex + 1) % totalPlayers;
  while (players[nextIndex].isBankrupt) {
    nextIndex = (nextIndex + 1) % totalPlayers;
    if (nextIndex === currentIndex) break;
  }

  return nextIndex;
};
