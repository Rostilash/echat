import React, { useState } from "react";
import style from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "./../../hooks/useMediaQuery";
import { useAuth } from "./../../hooks/useAuth";

export const Sidebar = ({ posts = [] }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { logout, currentUser } = useAuth();
  const [openQuitMenu, setOpenQuitMenu] = useState(false);

  const handleOpenQuitOption = () => {
    setOpenQuitMenu((prev) => !prev);
  };
  return (
    <aside className={style.sidebar}>
      <div className={style.menu}>
        <div className={style.logo}>
          <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/3665/3665930.png" />
          chat
        </div>

        <Link to="/echat/" className={style.menuItem}>
          <img src="https://cdn-icons-png.flaticon.com/128/15527/15527317.png" alt="icon" />
          <span>Головна</span>
        </Link>
        <Link to="/echat/top-places" className={style.menuItem}>
          <img src="https://cdn-icons-png.flaticon.com/128/9908/9908202.png" alt="icon" /> <span>Топ місця</span>
        </Link>
        <Link to="/echat/movies" className={style.menuItem}>
          <img src="https://cdn-icons-png.flaticon.com/128/6815/6815074.png" alt="icon" />
          <span>Фільми</span>
        </Link>
        <Link to="/echat/news" className={style.menuItem}>
          <img src="https://cdn-icons-png.flaticon.com/128/10288/10288957.png" alt="icon" />
          <span>Новини</span>
        </Link>
        <Link to="/echat/weather" className={style.menuItem}>
          <img src="https://cdn-icons-png.flaticon.com/128/8918/8918108.png" alt="icon" /> <span>Погода</span>
        </Link>
        {!isMobile && (
          <>
            <Link to="/echat/profile" className={style.menuItem}>
              <img src="https://cdn-icons-png.flaticon.com/128/9068/9068871.png" alt="icon" /> <span>Профіль</span>
            </Link>
            <Link to="/echat/movies" className={style.menuItem}>
              <img src="https://cdn-icons-png.flaticon.com/128/8106/8106905.png" alt="icon" />
              <span>Інші дії</span>
            </Link>
          </>
        )}
      </div>

      <div className={style.authLinks}>
        {currentUser ? (
          <>
            <div style={{ cursor: "pointer" }} onClick={handleOpenQuitOption}>
              <img className={style.user_image} src={currentUser.profileImage} alt="icon" />{" "}
              <div className={style.user_info}>
                <span className={style.info_name}>{currentUser.name}</span>
                <span className={style.info_address}>@AcrossFear</span>
              </div>
              {openQuitMenu && (
                <button onClick={logout} className={style.logoutBtn}>
                  Вийти
                </button>
              )}
            </div>
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
