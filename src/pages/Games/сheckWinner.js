export const checkWinner = (board) => {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  let filledLines = [];

  for (let line of winCombinations) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];

    // Winner
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: line };
    }

    // this for take fields in red color
    if (values.every((v) => v !== "") && new Set(values).size > 1) {
      filledLines.push(line);
    }
  }

  if (filledLines.length > 0) {
    return { filled: filledLines.flat(), ditailsText: `Лінія заповнена ` }; // Робимо один масив зі всіх індексів
  }

  return null;
};
