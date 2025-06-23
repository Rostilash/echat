export const Board = ({ board, onClick }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
      {board.map((cell, index) => (
        <div
          key={index}
          onClick={() => onClick(index)}
          style={{
            width: 100,
            height: 100,
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 36,
          }}
        >
          {cell}
        </div>
      ))}
    </div>
  );
};
