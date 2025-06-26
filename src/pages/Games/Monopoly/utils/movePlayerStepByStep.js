export const movePlayerStepByStep = async (playerIndex, steps, setPlayers, board) => {
  return new Promise((resolve) => {
    let step = 0;

    const interval = setInterval(() => {
      setPlayers((prev) => {
        const updated = [...prev];
        const player = { ...updated[playerIndex] };

        player.position = (player.position + 1) % board.length;
        updated[playerIndex] = player;

        return updated;
      });

      step++;

      if (step >= steps) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
};
