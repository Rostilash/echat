import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "../styles/Messages.module.css";
import { useAuth } from "./../../../hooks/useAuth";
import { generateChatId, sendMessage, getMessages, markMessagesAsRead, clearChatUsers } from "../utils/chatUtils";
import { Button } from "../../../components/Button/Button";

export const Messages = () => {
  const { currentUser } = useAuth();
  const isOwner = currentUser?.nickname;
  const chatNickNames = Array.isArray(currentUser?.chatUsers) ? currentUser.chatUsers : []; // ['johndoe', 'janesmith']

  const [selectedUserId, setSelectedUserId] = useState(chatNickNames ? chatNickNames[chatNickNames.length - 1] : null);

  const [chatMessages, setChatMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredChat, setFilteredChat] = useState([]);

  // Set all users from LocalStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [
      {
        id: 1,
        name: "John Doe",
        nickname: "johndoe",
        isOnline: true,
        lastMessage: "Hey, are you there?",
        hasUnread: true,
        avatar: "https://yt3.ggpht.com/VmwWA_exW4qoX1YSPfCJlpDh3lDjguBsaXSSPu6yltzZoLcu7oXvcCAUUheg8SLLzGWvnURTbA=s48-c-k-c0x00ffffff-no-rj",
      },
    ];
    setAllUsers(users);
  }, []);

  // Filter that users have that nick name
  const visibleUsers = allUsers.filter((user) => chatNickNames.includes(user.nickname));

  // visibile users for current user
  const enhancedVisibleUsers = visibleUsers.map((user) => {
    const chatId = generateChatId(currentUser.nickname, user.nickname);
    const messages = getMessages(chatId);

    const lastMsg = [...messages].reverse().find((msg) => msg.from !== currentUser.nickname || msg.to !== currentUser.nickname); // Let's take the last one that's not from you to you.

    const hasUnread = messages.some((msg) => msg.to === currentUser.nickname && !msg.isRead);

    return {
      ...user,
      lastMessage: lastMsg?.from === currentUser.nickname ? `Ви: ${lastMsg.content}` : lastMsg?.content || "No messages yet",
      hasUnread,
    };
  });

  // Selected User
  useEffect(() => {
    if (chatNickNames?.length) {
      setSelectedUserId(chatNickNames[chatNickNames.length - 1]);
    }
  }, [chatNickNames]);

  const selectedUser = allUsers.find((u) => u.nickname === selectedUserId);

  // Our Messages
  useEffect(() => {
    if (selectedUser) {
      const chatId = generateChatId(currentUser.nickname, selectedUser.nickname);
      const messages = getMessages(chatId);
      setChatMessages((prev) => ({
        ...prev,
        [selectedUser.nickname]: messages,
      }));

      markMessagesAsRead(chatId, currentUser.nickname);
    }
  }, [selectedUser]);

  // Send Button
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!selectedUser) {
      alert("Ви не обрали співрозмовника!");
      return;
    }

    sendMessage(currentUser.nickname, selectedUser.nickname, inputMessage);

    const chatId = generateChatId(currentUser.nickname, selectedUser.nickname);
    const updatedMessages = getMessages(chatId);

    setChatMessages((prev) => ({
      ...prev,
      [selectedUser.nickname]: updatedMessages,
    }));

    setInputMessage("");
  };

  // find user
  const handleFindUser = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredUsers([]);
      return;
    }
    const matched = enhancedVisibleUsers.filter((user) => user.name.toLowerCase().includes(value));
    setFilteredUsers(matched);
  };

  //find chat
  const handleFindChat = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value && !chatMessages[selectedUserId]) {
      setFilteredChat([]);
      return;
    }

    const filtered = chatMessages[selectedUserId].filter((message) => message.content.toLowerCase().includes(value));
    console.log(filtered);
    setFilteredChat(filtered || []);
  };

  const handleClick = () => {
    clearChatUsers();
  };
  return (
    <div className={style.container}>
      {/* Left Sidebar */}
      <div className={style.sidebar}>
        <div className={style.sidebarHeader}>
          <Link to="/echat/" className={style.backLink}>
            ← Back
          </Link>
          <input className={style.searchInput} placeholder="Пошук Користувача..." onChange={handleFindUser} />
        </div>
        <div className={style.usersList}>
          {(filteredUsers.length > 0 ? filteredUsers : enhancedVisibleUsers).map((user) => (
            <div
              key={user.nickname}
              onClick={() => setSelectedUserId(user.nickname)}
              className={`${style.userItem} ${user.hasUnread ? style.unread : ""}`}
            >
              <img src={user.profileImage} alt={user.name} className={style.avatar} />
              <div className={style.userInfo}>
                <div className={style.userHeader}>
                  <span>{user.name}</span>
                  {user.isOnline && <span className={style.onlineDot}></span>}
                  {user.hasUnread && <span className={style.unreadDot}></span>}
                </div>
                <p className={style.lastMessage}>{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
        {/* <Button onClick={handleClick} variant="empty">
          Видалити всі розмови
        </Button> */}
      </div>

      {/* Right Chat Area */}
      <div className={style.chatArea}>
        <div className={style.chatHeader}>
          <div>
            {selectedUser && (
              <>
                <h2>
                  {selectedUser.name} <span className={style.username}>{selectedUser.nickname}</span>
                </h2>
                {selectedUser.isOnline && <span className={style.onlineText}>Онлайн</span>}
              </>
            )}
          </div>

          <input className={style.searchChat} placeholder="Пошук в чаті..." onChange={handleFindChat} />
        </div>

        <div className={style.chatBody}>
          {(filteredChat.length > 0 ? filteredChat : chatMessages[selectedUserId] || []).map((msg, index) => (
            <div key={index} className={msg.from === isOwner ? style.myMessage : style.theirMessage}>
              <p>{msg.content}</p>
              <span className={style.timestamp}>{msg.timestamp}</span>
            </div>
          ))}
        </div>

        <div className={style.chatInput}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Написати повідомлення..."
            className={style.textarea}
          />
          {/* In production, add emoji picker, GIFs, image uploader here */}
          <button onClick={handleSendMessage} className={style.sendButton}>
            Надіслати
          </button>
        </div>
      </div>
    </div>
  );
};
