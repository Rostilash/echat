import style from "../../styles/CellImage.module.css";

export const RenderCellImage = ({ cell, position, canBuild }) => {
  return (
    <>
      {cell.img && (
        <img
          src={cell.img}
          alt="flag"
          className={`${style.flag} ${style[`flag${position}`]}`}
          style={{
            boxShadow: canBuild ? `0px 0px 10px 2px ${cell.color}, 0 0 10px 2px ${cell.color}55` : "none",
            backdropFilter: canBuild ? "blur(2px)" : "none",
            WebkitBackdropFilter: canBuild ? "blur(6px)" : "none",
          }}
        />
      )}
    </>
  );
};
