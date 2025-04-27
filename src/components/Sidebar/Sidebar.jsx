import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Sidebar.module.css";
import { useMediaQuery } from "./../../hooks/useMediaQuery";

export const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/echat/login");
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        {/* <div className={style.logo}>echat</div> */}
        <Link to="/echat/" className={style.menuItem}>
          E-Chat
        </Link>
        <Link to="/echat/" className={style.menuItem}>
          🏠
        </Link>
        {/* <Link to="/echat/search" className={style.menuItem}>
          🔍
        </Link> */}
        <Link to="/echat/top-places" className={style.menuItem}>
          Top places
        </Link>
        <Link to="/echat/movies" className={style.menuItem}>
          Movies
        </Link>

        <Link to="/echat/news" className={style.menuItem}>
          📰 News
        </Link>
        {!isMobile && (
          <>
            <Link to="/echat/profile" className={style.menuItem}>
              👤 Профіль
            </Link>
            <Link to="/echat/movies" className={style.menuItem}>
              More
            </Link>
          </>
        )}
      </div>

      <div className={style.authLinks}>
        {currentUser ? (
          <>
            <span>👋 {currentUser.name}</span>
            <button onClick={handleLogout} className={style.logoutBtn}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/echat/register/l" className={style.authLink}>
              Вхід
            </Link>
            <Link to="/echat/register/r" className={style.authLink}>
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};
