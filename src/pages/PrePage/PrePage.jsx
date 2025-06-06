import React, { useState } from "react";
import style from "./PrePage.module.css";
import { Link } from "react-router-dom";
import { Button } from "./../../components/Button/Button";
import { Register } from "../../components/Register/Register";
import { Login } from "../../components/Login/Login";
import { useAuth } from "../../hooks/useAuth";

export const PrePage = () => {
  const [isRightSideHidden, setIsRightSideHidden] = useState(null);
  const { signInWithGoogleDrive } = useAuth();

  const handleLoginClick = () => {
    setIsRightSideHidden("login");
  };
  const handleRegisterClick = () => {
    setIsRightSideHidden("register");
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogleDrive();
      if (result.success) {
        // Наприклад, зберегти токен або юзера у стані
        setMessage("Успішний вхід через Google");
      } else {
        setMessage("Помилка входу через Google: " + result.error.message);
      }
    } catch (error) {
      setMessage("Помилка при авторизації: " + error.message);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.leftSide}>
        <img src="/menu_icons/echat_white.png" alt="" />
        <h1 className={style.brandTitle}>chat</h1>
      </div>
      {/* main page  */}
      {isRightSideHidden === null && (
        <div className={style.rightSide}>
          <h1 className={style.title}>Вітаємо вас в Echat</h1>
          <p className={style.subtitle}>Приєднуйтеся сьогодні.</p>

          {/* Social buttons */}
          <div className={style.socialButtons}>
            <span style={{ backgroundColor: "rgba(255, 255, 255, 0.842)" }}> Тимчасово не працює</span>
            <Button size="extra-large" position="center" variant="facebook" disabled title="Тимчасово не працює">
              Увійти через Facebook
              <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/15047/15047435.png" />
            </Button>

            <Button size="extra-large" position="center" variant="google" disabled title="Тимчасово не працює" onClick={handleGoogleSignIn}>
              Увійти через Google
              <img className={style.icon} src="https://cdn-icons-png.flaticon.com/128/720/720255.png" />
            </Button>
          </div>

          {/* Text with hr lines*/}
          <div className={style.hrWrapper}>
            <hr className={style.hrLine} />
            <p className={style.orText}>АБО</p>
            <hr className={style.hrLine} />
          </div>

          <Button size="extra-large" position="center" onClick={handleRegisterClick}>
            Створити профіль
            <img className={style.icon} src="/menu_icons/echat_white.png" />
          </Button>

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
          <Button size="medium" onClick={handleLoginClick} variant="white">
            Увійти
          </Button>
        </div>
      )}

      {/* login page */}
      {isRightSideHidden === "login" && (
        <div className={style.rightSide}>
          <Login onClose={() => setIsRightSideHidden(null)} setRegisterForm={() => setIsRightSideHidden("register")} />
        </div>
      )}

      {/* register page */}
      {isRightSideHidden === "register" && (
        <div className={style.rightSide}>
          <Register onClose={() => setIsRightSideHidden(null)} setLoginForm={() => setIsRightSideHidden("login")} />
        </div>
      )}
    </div>
  );
};
