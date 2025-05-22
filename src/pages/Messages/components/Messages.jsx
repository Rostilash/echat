import style from "../styles/Messages.module.css";
import { useState } from "react";
import { useAuth } from "./../../../hooks/useAuth";
import { ChatSideBar } from "./ChatSideBar";
import { ChatHeader } from "./СhatHeader.jsx";
import { ChatBody } from "./ChatBody.jsx";
import { ChatActions } from "./ChatActions";
import { useMessages } from "../../../context/MessageContext.jsx";

export const Messages = ({ UrlID }) => {
  // Get currentUser from context
  const { currentUser, ownerUid } = useAuth();
  // get chat messages and chat users
  const { allUsers, deleteAllUserChats, allMessages } = useMessages();
  // Open the eddit page
  const [isEditing, setIsEditing] = useState(false);
  // Take information of message (id , text, edit true)
  const [messageIdToEdit, setMessageIdToEdit] = useState(null);
  // Textarea text state
  const [sendText, setSendText] = useState("");
  // Searching in chat
  const [filteredChat, setFilteredChat] = useState([]);
  // Take information about selected user by URL chatId

  const selectedUser = allUsers.find((u) => u.id === UrlID);

  return (
    <div className={style.container}>
      {/* Left Sidebar */}
      <ChatSideBar users={allUsers} deleteAllUserChats={deleteAllUserChats} allMessages={allMessages} ownerUid={ownerUid} UrlID={UrlID} />
      {/* Right Chat Area */}
      <div className={style.chatArea}>
        {/* need to add messages */}
        <ChatHeader selectedUser={selectedUser} setFilteredChat={setFilteredChat} />
        {/* Main chat body page (setEdit by id)*/}
        <ChatBody
          filteredChat={filteredChat}
          isOwnId={ownerUid}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setMessageIdToEdit={setMessageIdToEdit}
          setSendText={setSendText}
        />
        {/* Text acitons (add,confirm edit,delete)  */}
        <ChatActions
          currentUser={currentUser}
          chatId={UrlID}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setSendText={setSendText}
          sendText={sendText}
          messageIdToEdit={messageIdToEdit}
        />
      </div>
    </div>
  );
};
