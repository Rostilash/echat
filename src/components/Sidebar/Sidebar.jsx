import React from "react";
import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import { useMediaQuery } from "./../../hooks/useMediaQuery";
import { useAuth } from "./../../hooks/useAuth";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { logout, currentUser } = useAuth();

  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        <div className={style.logo}>echat</div>

        <Link to="/echat/" className={style.menuItem}>
          🏠
        </Link>
        <Link to="/echat/top-places" className={style.menuItem}>
          Топ місця
        </Link>
        <Link to="/echat/movies" className={style.menuItem}>
          Фільми
        </Link>
        <Link to="/echat/news" className={style.menuItem}>
          Новини
        </Link>
        {!isMobile && (
          <>
            <Link to="/echat/profile" className={style.menuItem}>
              Профіль
            </Link>
            <Link to="/echat/movies" className={style.menuItem}>
              Більше
            </Link>
          </>
        )}
      </div>

      <div className={style.authLinks}>
        {currentUser ? (
          <>
            <span>👋 {currentUser.name}</span>
            <button onClick={logout} className={style.logoutBtn}>
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
