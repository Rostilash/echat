export const getWinDefaultCombo = (properties) => {
  if (!properties) return;
  const win_combo = [
    [1, 3],
    [6, 8, 9],
    [11, 13, 14],
    [16, 18, 19],
    [21, 23, 24],
    [26, 27, 29],
    [31, 32, 34],
    [37, 40],
  ];

  const matchedCombos = win_combo.filter((combo) => combo.every((num) => properties.includes(num)));

  return matchedCombos;
};
