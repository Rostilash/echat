import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find((user) => user.email === formData.email && user.password === formData.password);

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      navigate("/echat/", { replace: true });
    } else {
      setErrorMessage("❌ Password incorrect ");
    }
  };

  return (
    <div className={style.login_wrapper}>
      <form className={style.login_form} onSubmit={handleSubmit}>
        <h2>Вхід</h2>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <button type="submit">Увійти</button>

        {errorMessage && <p className={style.error_message}>{errorMessage}</p>}
      </form>
    </div>
  );
};
