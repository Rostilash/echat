import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Header.module.css";

export const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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
    <header className="header">
      <nav className="nav">
        <Link className="logo" to="/echat/">
          Echat
        </Link>

        <div className="nav-links">
          <Link to="/echat/news">Новини</Link>
          <Link to="/echat/top-places">Топ заклади</Link>
          <Link to="/echat/movies">Фільми</Link>
        </div>

        <div className="auth-links">
          {currentUser ? (
            <>
              <span>👋 Привіт, {currentUser.name}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/echat/login/l">Вхід</Link>
              <Link to="/echat/register/r">Реєстрація</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
