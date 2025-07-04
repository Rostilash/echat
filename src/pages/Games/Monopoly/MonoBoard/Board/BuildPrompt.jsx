import React from "react";
import style from "../../styles/BuildPrompt.module.css";

export const BuildPrompt = ({ cell, onBuild, position, ifCurrentPlayer, canBuild }) => {
  return (
    <>
      {cell.type === "property" && (
        <>
          {cell.owner ? (
            <>
              <div className={`${style.colorStrip} ${style[`strip${position}`]} `} style={{ backgroundColor: cell.color }} />
              {cell.upgradeLevel && (
                <div className={`${style.canBuildLabel} ${style[`build${position}`]}  ${style[`show_upgraded_${position}`]}`}>
                  {cell.upgradeLevel && cell.upgradeLevel > 0 ? `🏠 x ${cell.upgradeLevel}` : ""}
                </div>
              )}
            </>
          ) : (
            <div className={` ${style.colorStrip}  ${style[`strip${position}`]} `}>
              <span className={`${style.price_num} ${style[`price${position}_num`]}`}>{cell.price}</span>
            </div>
          )}
        </>
      )}

      {cell.upgradeLevel >= 5 ||
        (ifCurrentPlayer && canBuild && (
          <>
            <div className={`${style.canBuildLabel} ${style[`build${position}`]}`}>
              {cell.upgradeLevel >= 5 ? "" : <span>{cell.price}$</span>}
              <button
                style={{ backgroundColor: `${cell.owner ? "#ffb400" : ""}` }}
                onClick={() => onBuild(cell.id, cell.price, cell.upgradeLevel ?? "")}
              >
                {cell.upgradeLevel > 0 && `🏠 x ${cell.upgradeLevel}`}
              </button>
            </div>
          </>
        ))}

      {cell.type === "railroad" && (
        <>
          {cell.owner ? (
            <div className={`${style.colorStrip} ${style[`strip${position}`]} `} style={{ backgroundColor: cell.color }}></div>
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
