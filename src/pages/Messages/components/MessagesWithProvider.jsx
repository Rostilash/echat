import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Messages } from "./Messages";
import { MessageProvider } from "../../../context/MessageContext";
import { useAuth } from "../../../hooks/useAuth";

export const MessagesWithProvider = () => {
  const { currentUser } = useAuth();
  const { nickname } = useParams();
  const [users, setUsers] = useState([]);

  // update users
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users"));
    if (users) {
      setUsers(users);
    }
  }, []);

  return (
    <MessageProvider chatId={nickname} currentUser={currentUser}>
      <Messages users={users} chatId={nickname} />
    </MessageProvider>
  );
};
