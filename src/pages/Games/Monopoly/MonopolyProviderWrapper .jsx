import { useParams } from "react-router-dom";
import { MonopolyProvider } from "../../../context/MonopolyContext";
import { MonopolyContainer } from "./MonopolyContainer";

export const MonopolyProviderWrapper = () => {
  const { id } = useParams();

  return (
    <MonopolyProvider gameId={id}>
      <MonopolyContainer />
    </MonopolyProvider>
  );
};
