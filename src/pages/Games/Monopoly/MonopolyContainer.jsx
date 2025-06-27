import React, { useContext } from "react";
import { MonopolyContext } from "../../../context/MonopolyContext";
import { Outlet } from "react-router-dom";

export const MonopolyContainer = () => {
  const context = useContext(MonopolyContext);

  return (
    <div>
      <Outlet context={context} />
    </div>
  );
};
