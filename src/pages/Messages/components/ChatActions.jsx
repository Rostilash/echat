import { useMessages } from "../../../context/MessageContext";
import style from "../styles/Messages.module.css";
import { useState } from "react";
import { Button } from "./../../../components/Button/Button";

export const ChatActions = ({ currentUser, chatId, isEditing, setIsEditing, setSendText, sendText, messageIdToEdit }) => {
  //  functions from context
  const { sendMessage, editMessage } = useMessages();

  // Send message to FireBase
  const handleSendMessage = () => {
    if (sendText.length > 0) {
      // Send to FireBase
      sendMessage({
        content: sendText,
        from: currentUser.uid,
        to: chatId,
      });
      setSendText("");
    }
  };
  // Get id & text
  const handleUpdateMessage = () => {
    editMessage(messageIdToEdit, sendText);
    setSendText("");
    setIsEditing(false);
  };
  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setSendText("");
  };

  return (
    <form
      className={style.chatInput}
      onSubmit={(e) => {
        e.preventDefault();
        isEditing ? handleUpdateMessage() : handleSendMessage();
      }}
    >
      <textarea value={sendText} onChange={(e) => setSendText(e.target.value)} placeholder="Написати повідомлення..." className={style.textarea} />

      {/* In production, add emoji picker, GIFs, image uploader here */}

      {isEditing ? (
        <>
          <Button onClick={handleUpdateMessage} variant="success" size="medium">
            Зберегти зміни
          </Button>

          <Button onClick={handleCancel} variant="default" size="medium">
            Відмінити
          </Button>
        </>
      ) : (
        <button type="submit" className={style.sendButton} disabled={sendText.trim() === ""}>
          Надіслати
        </button>
      )}
    </form>
  );
};
