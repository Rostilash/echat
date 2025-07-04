import React from "react";
import style from "../../styles/MonoBoard.module.css";
import { GetBoardPlayers } from "../GetBoardPlayers";
import { getCellPosition } from "../../utils/getCellPosition";
import { BuildPrompt } from "./BuildPrompt";
import { RenderCellImage } from "./RenderCellImage";

export const MonoBoard = ({ board, upgradeCityRent, currentPlayer, ifCurrentPlayer, players }) => {
  const handleUpgradeCity = (cityId, price, upgradeLevel) => {
    upgradeCityRent(cityId, price, upgradeLevel);
  };

  return (
    <div className={style.board}>
      {board.map((cell, index) => {
        const canBuild = currentPlayer?.buildableCells?.includes(cell.id);
        const isCorner = ["p1", "p11", "p21", "p31"].includes(`p${cell.id + 1}`);
        const position = getCellPosition(cell.id);

        return (
          <div
            key={cell.id}
            className={`${style.cell} ${canBuild ? style.canBuild : ""} ${isCorner ? style.corner : ""}`}
            style={{
              gridArea: `p${cell.id + 1}`,
            }}
          >
            {/* main cell color */}
            <div
              className={style.cellBackground}
              style={{
                backgroundColor: `${cell.color}`,
              }}
            />
            {/* main cell color */}
            <div className={style.cellBackground}>
              <img src={cell.img} alt="flag" />
            </div>

            <RenderCellImage cell={cell} position={position} canBuild={canBuild} />

            <BuildPrompt cell={cell} onBuild={handleUpgradeCity} position={position} ifCurrentPlayer={ifCurrentPlayer} canBuild={canBuild} />

            <GetBoardPlayers players={players} cell={cell} />

            <span className={`${style.cityName} ${style[`text${position}`]}`}>{cell.name}</span>
          </div>
        );
      })}
    </div>
  );
};
