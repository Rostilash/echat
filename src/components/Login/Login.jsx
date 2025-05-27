import { useState, useEffect } from "react";
import style from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { CloseButton } from "../Button/CloseButton";

export const Login = ({ onClose, setRegisterForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      navigate("/echat/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "email") {
      setEmailError("");
    }
    if (e.target.name === "password") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setEmailError("Некоректний email");
      isValid = false;
    }

    const password = formData.password;
    if (password.length < 6) {
      setPasswordError("Пароль повинен містити щонайменше 6 символів");
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Пароль повинен містити хоча б одну малу літеру");
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Пароль повинен містити хоча б одну велику літеру");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isLoginSuccessful = await login(formData.email, formData.password);

    if (isLoginSuccessful) {
      navigate("/echat/", { replace: true });
    } else {
      setErrorMessage("Невірний email або пароль");
    }
  };

  return (
    <div className={style.login_wrapper}>
      <form className={style.login_form} onSubmit={handleSubmit}>
        <CloseButton onClose={onClose} />

        <h2>Вхід</h2>
        <p className={style.password_hint}>Пароль має містити щонайменше 6 символів, одну **велику** та одну **малу** літеру.</p>
        <p>
          Новий користувач?{" "}
          <span className={style.termsLink} onClick={setRegisterForm}>
            Реєструйся прямо зараз!{" "}
          </span>{" "}
        </p>

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
          icon="https://cdn-icons-png.flaticon.com/128/2669/2669570.png"
          required
        />

        <Input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          error={passwordError}
          icon="https://cdn-icons-png.flaticon.com/128/25/25239.png"
          required
        />

        <Button position="center" type="submit" size="large">
          Увійти
        </Button>

        {errorMessage && <p className={style.error_message}>{errorMessage}</p>}
      </form>
    </div>
  );
};
