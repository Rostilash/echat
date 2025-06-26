export const clearPlayerProperties = (player, setBoard) => {
  const propertiesToClear = [...player.properties];
  setTimeout(() => {
    setBoard((prevBoard) => prevBoard.map((cell) => (propertiesToClear.includes(cell.id) ? { ...cell, owner: null, color: "grey" } : cell)));
  }, 0);
};
