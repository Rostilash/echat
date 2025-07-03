export const getCellPosition = (cellId) => {
  const id = cellId + 1;
  if ([2, 3, 4, 5, 6, 7, 8, 9, 10].includes(id)) return "Top";
  if ([12, 13, 14, 15, 16, 17, 18, 19, 20].includes(id)) return "Right";
  if ([30, 29, 28, 27, 26, 25, 24, 23, 22].includes(id)) return "Bottom";
  if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(id)) return "Left";
  return "";
};
