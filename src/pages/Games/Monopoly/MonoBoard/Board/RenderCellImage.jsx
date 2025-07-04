import style from "../../styles/CellImage.module.css";

export const RenderCellImage = ({ cell, position }) => {
  const monopily = cell.upgradeLevel > 0;
  return (
    <>
      {cell.img && (
        <img
          src={cell.img}
          alt="flag"
          className={`${style.flag} ${style[`flag${position}`]}`}
          style={{
            boxShadow: monopily ? `0px 0px 10px 2px ${cell.color}, 0 0 10px 2px ${cell.color}55` : "none",
            backdropFilter: monopily ? "blur(2px)" : "none",
            WebkitBackdropFilter: monopily ? "blur(6px)" : "none",
          }}
        />
      )}
    </>
  );
};
