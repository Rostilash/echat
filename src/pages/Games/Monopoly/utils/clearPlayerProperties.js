export const clearPlayerProperties = (player, board) => {
  const propertiesToClear = [...player.properties];
  return board.map((cell) => (propertiesToClear.includes(cell.id) ? { ...cell, owner: null, color: "grey" } : cell));
};
