import React from "react";
import style from "./Profile.module.css";
import { useTheme } from "./../../hooks/useTheme";

export const Profile = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={style.profile}>
      <h1>Theme</h1>
      <div className={style.themeSwitcher}>
        <button onClick={toggleTheme} className={style.themeButton}>
          {theme === "light" ? "🌙 Ніч" : "☀️ День"}
        </button>
      </div>
    </div>
  );
};
