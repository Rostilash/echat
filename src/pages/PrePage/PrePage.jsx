import React, { useState } from "react";
import style from "./PrePage.module.css";
import { Link } from "react-router-dom";
import { Login } from "./../Login/Login";

export const PrePage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.leftSide}>
        <h1 className={style.brandTitle}>Echat</h1>
      </div>

      <div className={style.rightSide} style={{ display: isLoginVisible ? "none" : "flex" }}>
        <h1 className={style.title}>Вітаємо вас в Echat</h1>
        <p className={style.subtitle}>Приєднуйтеся сьогодні.</p>

        <div className={style.socialButtons}>
          <button className={style.facebookButton}>
            Увійти через Facebook
            <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/15047/15047435.png" />
          </button>

          <button className={style.googleButton}>
            Увійти через Google
            <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/720/720255.png" />
          </button>
        </div>

        <div className={style.hrWrapper}>
          <hr className={style.hrLine} />
          <p className={style.orText}>АБО</p>
          <hr className={style.hrLine} />
        </div>

        <Link to="/echat/register/r" className={style.registerButton}>
          Створити профіль
          <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/3665/3665930.png" />
        </Link>

        <p className={style.terms}>
          Реєструючись, ви погоджуєтеся з{" "}
          <Link to="/terms" className={style.termsLink}>
            Умовами надання послуг{" "}
          </Link>
          і{" "}
          <Link to="/privacy" className={style.termsLink}>
            Політикою конфіденційності
          </Link>
          , включаючи{" "}
          <Link to="/cookies" className={style.termsLink}>
            Політику використання файлів cookie
          </Link>
          .
        </p>

        <p className={style.alreadyHaveAccount}>У вас вже є профіль?</p>
        <div className={style.loginLink} onClick={handleLoginClick}>
          Увійти
        </div>
      </div>

      {isLoginVisible && (
        <div className={style.rightSide}>
          <Login />
        </div>
      )}
    </div>
  );
};
