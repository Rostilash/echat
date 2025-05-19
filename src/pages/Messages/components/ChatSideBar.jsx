import style from "../styles/ChatSideBar.module.css";
import { ToMainPage } from "./../../../components/Button/Links/ToMainPage";
import { UsersChatNav } from "./UsersChatNav";
import { Button } from "./../../../components/Button/Button";
import { clearChatUsers, generateChatId, getMessages } from "../utils/chatUtils";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useMessages } from "../../../context/MessageContext";

export const ChatSideBar = ({ users }) => {
  // Get currentUser from Local Storage
  const { currentUser } = useAuth();
  const { messages } = useMessages();

  // Search users in chat
  const [filteredUsers, setFilteredUsers] = useState([]);

  const chatNickNames = Array.isArray(currentUser?.chatUsers) ? currentUser.chatUsers : []; // ['johndoe']

  // Filter users by nick names
  const visibleUsers = users.filter((user) => chatNickNames.includes(user.nickname));

  // Find last messages of users
  const enhancedVisibleUsers = visibleUsers.map((user) => {
    const chatId = generateChatId(currentUser.nickname, user.nickname);
    const messages = getMessages(chatId);

    const lastMsg = [...messages].reverse().find((msg) => msg.from !== currentUser.nickname || msg.to !== currentUser.nickname); // Let's take the last one that's not from you to you.
    // hasUnread
    const hasUnread = messages.some((msg) => msg.to === currentUser.nickname && !msg.isRead);

    return {
      ...user,
      lastMessage: lastMsg?.from === currentUser.nickname ? `Ви: ${lastMsg.content}` : lastMsg?.content || "No messages yet",
      hasUnread,
    };
  });

  // Search user from our visible users in chat
  const handleFindUser = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredUsers([]);
      return;
    }
    const matched = enhancedVisibleUsers.filter((user) => user.name.toLowerCase().includes(value));
    setFilteredUsers(matched);
  };
  // Testing with deleting all users from chatlist
  const handleClick = () => {
    clearChatUsers();
  };

  return (
    <div className={style.sidebar}>
      <div className={style.sidebarHeader}>
        <ToMainPage />

        <input className={style.searchInput} placeholder="Пошук Користувача..." onChange={handleFindUser} />
      </div>

      <div className={style.left_side}>
        <div className={style.usersList}>
          {(filteredUsers.length > 0 ? filteredUsers : enhancedVisibleUsers).map((user) => (
            <UsersChatNav key={user.nickname} user={user} />
          ))}
        </div>
        <div>
          <Button onClick={handleClick} variant="empty">
            Видалити всі розмови
          </Button>
        </div>
      </div>
    </div>
  );
};
