import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Register.module.css";
import { useAuth } from "./../../hooks/useAuth";

export const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.name.length < 2) {
      setSuccessMessage("❌ Ім'я повинно містити щонайменше 2 символи");
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setSuccessMessage("❌ Введіть коректний Email");
      return false;
    }

    if (formData.password.length < 6) {
      setSuccessMessage("❌ Пароль повинен містити щонайменше 6 символів");
      return false;
    }

    if (!["user", "admin"].includes(formData.role)) {
      setSuccessMessage("❌ Невірно вибрана роль");
      return false;
    }

    return true;
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      setSuccessMessage("❌ User with this Email already exist...");
      return;
    }

    register(formData);

    login(formData.email, formData.password);

    setSuccessMessage("Registration successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/echat/", { replace: true });
    }, 1500);
  }
  return (
    <div className={style.register_wrapper}>
      <form className={style.register_form} onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />

        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="user">Користувач</option>
          <option value="admin">Адмін</option>
        </select>

        <button type="submit">Зареєструватись</button>
      </form>
    </div>
  );
};
