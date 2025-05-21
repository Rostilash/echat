import { useParams } from "react-router-dom";
import { Messages } from "./Messages";
import { MessageProvider } from "../../../context/MessageContext";
import { useAuth } from "../../../hooks/useAuth";

export const MessagesWithProvider = () => {
  const { currentUser, loading } = useAuth();
  const { uid: UrlID } = useParams();

  if (loading) return <div>Loading user...</div>;
  if (!currentUser) return <div>Please log in</div>;

  return (
    <MessageProvider chatId={UrlID} currentUser={currentUser}>
      <Messages UrlID={UrlID} />
    </MessageProvider>
  );
};
