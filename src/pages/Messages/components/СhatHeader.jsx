import { Input } from "../../../components/Input/Input";
import { useMessages } from "../../../context/MessageContext";
import style from "../styles/Messages.module.css";

export const ChatHeader = ({ selectedUser, setFilteredChat, handleHideNav, hideNavBar }) => {
  const { messages } = useMessages();

  //find chat values
  const handleFindChat = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredChat([]);
      return;
    }
    const filtered = messages.filter((msg) => msg.content.toLowerCase().includes(value));

    setFilteredChat(filtered);
  };

  return (
    <div className={style.chatHeader}>
      {/* selected user info */}
      <div>
        {selectedUser && (
          <>
            <h2>
              {selectedUser.name} <span className={style.username}>{selectedUser.nickname}</span>
            </h2>
            {selectedUser.isOnline && <span className={style.onlineText}>Онлайн</span>}
            <button onClick={handleHideNav}>{hideNavBar ? "Показати меню" : "Сховати меню"}</button>
          </>
        )}
      </div>

      {/* find chat messages */}
      <div>
        <input className={style.searchChat} placeholder="Пошук в чаті..." onChange={handleFindChat} />
      </div>
    </div>
  );
};
