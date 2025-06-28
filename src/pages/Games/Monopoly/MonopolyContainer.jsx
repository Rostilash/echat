import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MonopolyContext } from "../../../context/MonopolyContext";

export const MonopolyContainer = () => {
  const context = useContext(MonopolyContext);

  return <Outlet context={context} />;
};
