import React from "react";
import { Link } from "react-router-dom";
import style from "./PrePage.module.css";

export const PrePage = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <h1 className={style.title}>Вітаємо вас в - Echat</h1>
        <p className={style.subtitle}>Приєднуйтеся сьогодні.</p>
        <div className={style.buttons}>
          <Link to="/echat/register/l" className={style.loginButton}>
            Вхід
          </Link>
          <Link to="/echat/register/r" className={style.registerButton}>
            Реєстрація
          </Link>
        </div>
      </div>
    </div>
  );
};
