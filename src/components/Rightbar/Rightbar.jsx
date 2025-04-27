import React from "react";
import style from "./Rightbar.module.css";
import { useTheme } from "./../../hooks/useTheme";

export const Rightbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside className={style.rightbar}>
      <div className={style.themeSwitcher}>
        <button onClick={toggleTheme} className={style.themeButton}>
          {theme === "light" ? "🌙 Ніч" : "☀️ День"}
        </button>
      </div>
      <h2>Новини</h2>
      <div className={style.newsItem}>Новина 1</div>
      <div className={style.newsItem}>Новина 2</div>
      <div className={style.newsItem}>Новина 3</div>
      <div className={style.newsItem}>
        {" "}
        © {new Date().getFullYear()} Ros<b>Dev</b>. Всі права захищено.
      </div>
    </aside>
  );
};
