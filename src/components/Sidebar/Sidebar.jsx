import React, { useState } from "react";
import style from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "./../../hooks/useMediaQuery";
import { useAuth } from "./../../hooks/useAuth";
import { getUserChats } from "../../pages/Messages/utils/chatUtils";

export const Sidebar = ({ selectedPostFilter }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { logout, currentUser } = useAuth();

  const [openQuitMenu, setOpenQuitMenu] = useState(false);

  const messages = getUserChats(currentUser?.id) || [];
  const hasUnread = messages.some((chat) => chat.messages.some((msg) => msg.to === currentUser?.nickname && !msg.isRead));

  const handleOpenQuitOption = () => {
    setOpenQuitMenu((prev) => !prev);
  };

  // links array
  const mainLinks = [
    {
      key: "main",
      path: "/",
      handleClick: () => selectedPostFilter(null),
      image: "https://cdn-icons-png.flaticon.com/128/15527/15527317.png",
      message: "Головна",
    },
    {
      key: "top",
      path: "/top-places",
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/5650/5650649.png",
      message: "Топ місця",
    },
    {
      key: "messages",
      path: `/message/${currentUser?.chatUsers?.[currentUser.chatUsers.length - 1] || currentUser?.id}`,
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/724/724689.png",
      message: "Повідомлення",
      // chatMessage: hasUnread,
    },
    {
      key: "movies",
      path: `/movies`,
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/6815/6815074.png",
      message: "Фільми",
    },
    {
      key: "news",
      path: "/news",
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/10288/10288957.png",
      message: "Новини",
    },
    {
      key: "weather",
      path: "/weather",
      handleClick: () => selectedPostFilter(null),
      image: "https://cdn-icons-png.flaticon.com/128/8918/8918108.png",
      message: "Погода",
    },
  ];

  if (!isMobile) {
    mainLinks.push(
      {
        key: "profile",
        path: `/profile/${currentUser?.id}`,
        handleClick: null,
        image: "https://cdn-icons-png.flaticon.com/128/9068/9068871.png",
        message: "Профіль",
      }
      // {
      //   key: "other_actions",
      //   path: null,
      //   handleClick: null,
      //   image: "https://cdn-icons-png.flaticon.com/128/8106/8106905.png",
      //   message: "Інші дії",
      // }
    );
  }

  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        <div className={style.logo}>
          <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/3665/3665930.png" />
          chat
        </div>

        {mainLinks.map(({ key, path, handleClick, image, message, chatMessage }) => (
          <Link key={key} to={path} className={style.menuItem} onClick={handleClick}>
            <img src={image} alt="icon" />
            <span>{message}</span>
            {chatMessage && <span className={style.unreadDot}></span>}
          </Link>
        ))}
      </div>

      <div className={style.authLinks}>
        <div style={{ cursor: "pointer", position: "relative" }} onClick={handleOpenQuitOption}>
          <img className={style.user_image} src={currentUser?.profileImage} alt="icon" />{" "}
          <div className={style.user_info}>
            <span className={style.info_name}>{currentUser?.name}</span>
            <span className={style.info_address}>@{currentUser?.nickname}</span>
          </div>
          {openQuitMenu && (
            <button onClick={logout} className={style.logoutBtn}>
              Вийти
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
