import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { useMessages } from "../../../context/MessageContext";
import { formatFullDateTime } from "../../../utils/dateUtils";
import style from "../styles/Messages.module.css";
import { Button } from "./../../../components/Button/Button";
import { useState, useRef, useEffect } from "react";

export const ChatBody = ({ isOwnId, setIsEditing, isEditing, filteredChat, setMessageIdToEdit, setSendText }) => {
  //  functions from context
  const { messages, loading, deleteMessage } = useMessages();

  const [contextMenu, setContextMenu] = useState(null); // { x, y, msg }

  const menuRef = useRef();
  const handleRightClick = (e, msg) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      msg,
    });
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleCloseMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
          <div
            key={index}
            className={msg.from === isOwnId ? style.myMessage : style.theirMessage}
            onContextMenu={(e) => msg.from === isOwnId && handleRightClick(e, msg)}
          >
            <p>{msg.content}</p>
            <span className={style.timestamp}>{formatFullDateTime(msg.timestamp)}</span>{" "}
          </div>
        ))
      ) : (
        <div className="loader-center">
          <LoaderSmall />
        </div>
      )}

      {contextMenu && (
        <div ref={menuRef} className={style.contextMenu} style={{ top: contextMenu.y, left: contextMenu.x, position: "absolute", zIndex: 1000 }}>
          <button
            onClick={() => {
              handleGetInfo(contextMenu.msg.id, contextMenu.msg.content);
              handleCloseMenu();
            }}
          >
            Редагувати
          </button>
          <button
            onClick={() => {
              deleteMessage(contextMenu.msg.id);
              handleCloseMenu();
            }}
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
};
