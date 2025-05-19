import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { useMessages } from "../../../context/MessageContext";
import { formatFullDateTime } from "../../../utils/dateUtils";
import style from "../styles/Messages.module.css";
import { Button } from "./../../../components/Button/Button";

export const ChatBody = ({ isOwner, setIsEditing, isEditing, filteredChat, setMessageIdToEdit, setSendText }) => {
  //  functions from context
  const { messages, loading, deleteMessage } = useMessages();

  //Set message to update on FireBase
  const handleGetInfo = (id, text) => {
    setMessageIdToEdit(id);
    setSendText(text);
    setIsEditing(true);
  };

  return (
    <div className={style.chatBody}>
      {!loading ? (
        (filteredChat.length > 0 ? filteredChat : messages).map((msg, index) => (
          <div key={index} className={msg.from === isOwner ? style.myMessage : style.theirMessage}>
            <p>
              {msg.content} {/* Delete the message */}
              {/* {isOwner && (
                <Button onClick={() => deleteMessage(msg.id)} variant="danger" size="small">
                  x
                </Button>
              )} */}
            </p>
            <span className={style.timestamp}>{formatFullDateTime(msg.timestamp)}</span>{" "}
            {isOwner && !isEditing && <button onClick={() => handleGetInfo(msg.id, msg.content)}>Редагувати</button>}
          </div>
        ))
      ) : (
        <div className="loader-center">
          <LoaderSmall />
        </div>
      )}
    </div>
  );
};
