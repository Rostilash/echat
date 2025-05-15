import React, { useState } from "react";
import style from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "./../../hooks/useMediaQuery";
import { useAuth } from "./../../hooks/useAuth";

export const Sidebar = ({ selectedPostFilter }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { logout, currentUser } = useAuth();
  const [openQuitMenu, setOpenQuitMenu] = useState(false);

  const handleOpenQuitOption = () => {
    setOpenQuitMenu((prev) => !prev);
  };

  // links array
  const mainLinks = [
    {
      key: "main",
      path: "/echat/",
      handleClick: () => selectedPostFilter(null),
      image: "https://cdn-icons-png.flaticon.com/128/15527/15527317.png",
      message: "Головна",
    },
    {
      key: "top",
      path: "/echat/top-places",
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/9908/9908202.png",
      message: "Топ місця",
    },
    {
      key: "messages",
      path: `/echat/message/${currentUser?.nickname}`,
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/724/724689.png",
      message: "Повідомлення",
    },
    {
      key: "movies",
      path: "/echat/movies",
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/6815/6815074.png",
      message: "Фільми",
    },
    {
      key: "news",
      path: "/echat/news",
      handleClick: null,
      image: "https://cdn-icons-png.flaticon.com/128/10288/10288957.png",
      message: "Новини",
    },
    {
      key: "weather",
      path: "/echat/weather",
      handleClick: () => selectedPostFilter(null),
      image: "https://cdn-icons-png.flaticon.com/128/8918/8918108.png",
      message: "Погода",
    },
  ];

  if (!isMobile) {
    mainLinks.push(
      {
        key: "profile",
        path: `/echat/profile/${currentUser?.nickname}`,
        handleClick: null,
        image: "https://cdn-icons-png.flaticon.com/128/9068/9068871.png",
        message: "Профіль",
      },
      {
        key: "other_actions",
        path: null,
        handleClick: null,
        image: "https://cdn-icons-png.flaticon.com/128/8106/8106905.png",
        message: "Інші дії",
      }
    );
  }

  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        <div className={style.logo}>
          <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/3665/3665930.png" />
          chat
        </div>

        {mainLinks.map(({ key, path, handleClick, image, message }) => (
          <Link key={key} to={path} className={style.menuItem} onClick={handleClick}>
            <img src={image} alt="icon" />
            <span>{message}</span>
          </Link>
        ))}
      </div>

      <div className={style.authLinks}>
        <div style={{ cursor: "pointer" }} onClick={handleOpenQuitOption}>
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
