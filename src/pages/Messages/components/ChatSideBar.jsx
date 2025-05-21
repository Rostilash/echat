import style from "../styles/ChatSideBar.module.css";
import { ToMainPage } from "./../../../components/Button/Links/ToMainPage";
import { UsersChatNav } from "./UsersChatNav";
import { Button } from "./../../../components/Button/Button";
import { useState } from "react";

export const ChatSideBar = ({ users, messages, deleteAllUserChats }) => {
  // Search users in chat
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Search user from our visible users in chat
  const handleFindUser = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredUsers([]);
      return;
    }
    const matched = users.filter((user) => user.name.toLowerCase().includes(value));
    setFilteredUsers(matched);
  };

  return (
    <div className={style.sidebar}>
      <div className={style.sidebarHeader}>
        <ToMainPage />

        <input className={style.searchInput} placeholder="Пошук Користувача..." onChange={handleFindUser} />
      </div>

      <div className={style.left_side}>
        <div className={style.usersList}>
          {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
            <UsersChatNav key={user.nickname} user={user} messages={messages} />
          ))}
        </div>
        <div>
          <h1>для тестування</h1>
          <Button
            onClick={() => {
              if (window.confirm("Ви впевнені, що хочете видалити всі розмови?")) {
                deleteAllUserChats();
              }
            }}
            variant="empty"
          >
            Видалити всі розмови
          </Button>
        </div>
      </div>
    </div>
  );
};
