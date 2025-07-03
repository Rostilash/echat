import React from "react";
import style from "../../styles/BuildPrompt.module.css";

export const BuildPrompt = ({ cell, onBuild, position, type, ifCurrentPlayer, canBuild }) => {
  return (
    <>
      {type === "build" && ifCurrentPlayer && canBuild && (
        <>
          <div className={`${style.canBuildLabel} ${style[`${type}${position}`]}`}>
            <span>{cell.price}$</span>
            <button
              style={{ backgroundColor: `${cell.owner ? "#ffb400" : ""}` }}
              onClick={() => onBuild(cell.id, cell.price, cell.upgradeLevel ?? "")}
            >
              {cell.upgradeLevel > 0 && `🏠 x ${cell.upgradeLevel}`}
            </button>
          </div>
        </>
      )}

      {cell.type === "property" && (
        <>
          {cell.owner ? (
            <div className={`${style.colorStrip} ${style[`strip${position}`]} `} style={{ backgroundColor: cell.color }} />
          ) : (
            <div className={` ${style.colorStrip}  ${style[`strip${position}`]} `}>
              <span className={`${style.price_num} ${style[`price${position}_num`]}`}>{cell.price}</span>
            </div>
          )}
        </>
      )}

      {cell.type === "railroad" && (
        <>
          {cell.owner ? (
            <div className={`${style.colorStrip} ${style[`strip${position}`]} `} style={{ backgroundColor: cell.color }} />
          ) : (
            <div className={` ${style.colorStrip}  ${style[`strip${position}`]} `}>
              <span className={`${style.price_num} ${style[`price${position}_num`]}`}>{cell.price}</span>
            </div>
          )}
        </>
      )}
    </>
  );
};
