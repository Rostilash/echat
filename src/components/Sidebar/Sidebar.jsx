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
      image: "/menu_icons/home.png",
      message: "Головна",
    },
    {
      key: "top",
      path: "/top-places",
      handleClick: null,
      image: "/menu_icons/top.png",
      message: "Топ місця",
    },
    {
      key: "messages",
      path: `/message/${currentUser?.chatUsers?.[currentUser.chatUsers.length - 1] || currentUser?.id}`,
      handleClick: null,
      image: "/menu_icons/messages.png",
      message: "Повідомлення",
      chatMessage: hasUnread,
    },
    {
      key: "movies",
      path: `/movies`,
      handleClick: null,
      image: "/menu_icons/movie.png",
      message: "Фільми",
    },
    {
      key: "news",
      path: "/news",
      handleClick: null,
      image: "/menu_icons/news.png",
      message: "Новини",
    },
    {
      key: "weather",
      path: "/weather",
      handleClick: () => selectedPostFilter(null),
      image: "/menu_icons/weather.png",
      message: "Погода",
    },
  ];

  if (!isMobile) {
    mainLinks.push(
      {
        key: "profile",
        path: `/profile/${currentUser?.id}`,
        handleClick: null,
        image: "/menu_icons/profile.png",
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
  const mainMobileLinks = [
    {
      key: "news",
      path: "/news",
      handleClick: null,
      image: "/menu_icons/news.png",
    },
    {
      key: "movies",
      handleClick: null,
      path: `/movies`,
      image: "/menu_icons/movie.png",
    },
    {
      key: "main",
      path: "/",
      handleClick: () => selectedPostFilter(null),
      image: "/menu_icons/home.png",
      style: { width: "40px", height: "40px" },
    },
    {
      key: "messages",
      path: `/message/${currentUser?.chatUsers?.[currentUser.chatUsers.length - 1] || currentUser?.id}`,
      handleClick: null,
      image: "/menu_icons/messages.png",
      chatMessage: hasUnread,
    },
    {
      key: "weather",
      path: "/weather",
      handleClick: () => selectedPostFilter(null),
      image: "/menu_icons/weather.png",
    },
  ];

  const filteredLinks = isMobile ? mainMobileLinks.filter((link) => ["news", "movies", "main", "messages", "weather"].includes(link.key)) : mainLinks;

  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        {!isMobile && (
          <Link className={style.logo} to="/">
            <img className={style.icon} src="/menu_icons/echat_text.png" />
            {/* chat */}
          </Link>
        )}

        {filteredLinks.map(({ key, path, handleClick, image, message, chatMessage, style: customStyle }) => (
          <Link key={key} to={path} className={style.menuItem} onClick={handleClick}>
            <img src={image} alt="icon" style={customStyle} />
            {!isMobile && <span>{message}</span>}
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
