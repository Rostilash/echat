import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "../styles/Messages.module.css";

// Dummy data for users and messages
const users = [
  {
    id: 1,
    name: "John Doe",
    username: "@johndoe",
    isOnline: true,
    lastMessage: "Hey, are you there?",
    hasUnread: true,
    avatar: "https://yt3.ggpht.com/VmwWA_exW4qoX1YSPfCJlpDh3lDjguBsaXSSPu6yltzZoLcu7oXvcCAUUheg8SLLzGWvnURTbA=s48-c-k-c0x00ffffff-no-rj",
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "@janesmith",
    isOnline: false,
    lastMessage: "Let's talk later.",
    hasUnread: false,
    avatar: "https://yt3.ggpht.com/VmwWA_exW4qoX1YSPfCJlpDh3lDjguBsaXSSPu6yltzZoLcu7oXvcCAUUheg8SLLzGWvnURTbA=s48-c-k-c0x00ffffff-no-rj",
  },
];

const initialMessages = {
  1: [
    { from: "them", content: "Hey!", timestamp: "10:00" },
    { from: "me", content: "Hi!", timestamp: "10:01" },
  ],
  2: [
    { from: "them", content: "Yo!", timestamp: "9:00" },
    { from: "me", content: "What's up?", timestamp: "9:05" },
  ],
};

export const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add new message to current chat
    const newMsg = {
      from: "me",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMsg],
    }));

    setInputMessage("");
  };

  return (
    <div className={style.container}>
      {/* Left Sidebar */}
      <div className={style.sidebar}>
        <div className={style.sidebarHeader}>
          <Link to="/echat/" className={style.backLink}>
            ← Back
          </Link>
          <input className={style.searchInput} placeholder="Search users..." />
        </div>
        <div className={style.usersList}>
          {users.map((user) => (
            <div key={user.id} onClick={() => setSelectedUserId(user.id)} className={`${style.userItem} ${user.hasUnread ? style.unread : ""}`}>
              <img src={user.avatar} alt={user.name} className={style.avatar} />
              <div className={style.userInfo}>
                <div className={style.userHeader}>
                  <span>{user.name}</span>
                  {user.isOnline && <span className={style.onlineDot}></span>}
                </div>
                <p className={style.lastMessage}>{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className={style.chatArea}>
        <div className={style.chatHeader}>
          <div>
            <h2>
              {selectedUser.name} <span className={style.username}>{selectedUser.username}</span>
            </h2>
            {selectedUser.isOnline && <span className={style.onlineText}>Online</span>}
          </div>
          <input className={style.searchChat} placeholder="Search in chat..." />
        </div>

        <div className={style.chatBody}>
          {(chatMessages[selectedUserId] || []).map((msg, index) => (
            <div key={index} className={msg.from === "me" ? style.myMessage : style.theirMessage}>
              <p>{msg.content}</p>
              <span className={style.timestamp}>{msg.timestamp}</span>
            </div>
          ))}
        </div>

        <div className={style.chatInput}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Write a message..."
            className={style.textarea}
          />
          {/* In production, add emoji picker, GIFs, image uploader here */}
          <button onClick={handleSendMessage} className={style.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
