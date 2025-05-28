import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Register.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { CloseButton } from "../Button/CloseButton";

export const Register = ({ onClose, setLoginForm }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // We remove the error for this field if it has become valid.
    if (name === "name" && value.length >= 6) {
      setErrors((prevErrors) => {
        const { name, ...rest } = prevErrors; // Removing the error for "name"
        return rest;
      });
    }

    if (name === "email" && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors; // Removing the error for "email"
        return rest;
      });
    }

    if (name === "password" && value.length >= 6) {
      setErrors((prevErrors) => {
        const { password, ...rest } = prevErrors; // Removing the error for "password"
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    setSuccessMessage("");

    if (formData.name.length < 6) {
      newErrors.name = "Ім'я повинно містити щонайменше 6 символів";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Введіть коректний Email";
    }

    const password = formData.password;
    if (password.length < 6) {
      newErrors.password = "Пароль повинен містити щонайменше 6 символів";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Пароль повинен містити хоча б одну малу літеру";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Пароль повинен містити хоча б одну велику літеру";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Check if there is such a user in localstorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      setSuccessMessage("Користувач з таким Email вже існує...");
      return;
    }

    // register the user
    register(formData);

    // if register successfully log in
    const isLoginSuccessful = await login(formData.email, formData.password);
    if (isLoginSuccessful) {
      setSuccessMessage("Реєстрація успішна!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/", { replace: true });
      }, 1000);
    } else {
      setErrorMessage("Щось пішло не так при вході після реєстрації.");
    }
  };

  return (
    <div className={style.register_wrapper}>
      <form className={style.register_form} onSubmit={handleSubmit}>
        <CloseButton onClose={onClose} />

        <h2>Реєстрація</h2>
        <p className={style.password_hint}>Пароль має містити щонайменше 6 символів, одну **велику** та одну **малу** літеру.</p>

        {!successMessage && <p className={style.success_message}>{successMessage}</p>}
        {successMessage && <p className={style.error_message}>{successMessage}</p>}

        <Input
          name="name"
          type="text"
          placeholder="Ім'я"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon="https://cdn-icons-png.flaticon.com/128/709/709699.png"
          alt="Ім'я"
          required
        />

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon="https://cdn-icons-png.flaticon.com/128/2669/2669570.png"
          alt="email"
          required
        />

        <Input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon="https://cdn-icons-png.flaticon.com/128/25/25239.png"
          alt="password"
          required
        />

        {/* <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="user">Користувач</option>
          <option value="admin">Адмін</option>
        </select> */}

        <Button type="submit" size="large">
          Зареєструватись
        </Button>

        <p>
          У мене вже є сторінка{" "}
          <span className={style.enter} onClick={setLoginForm}>
            Увійти
          </span>
        </p>
      </form>
    </div>
  );
};
