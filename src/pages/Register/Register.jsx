import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Register.module.css";

export const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");
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

  function handleSubmit(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      setSuccessMessage("❌ User with this Email already exist...");
      return;
    }

    const updatedUsers = [...users, formData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setSuccessMessage("Registration successfully!");

    setTimeout(() => {
      navigate("/echat/", { replace: true });
    }, 1500);
  }
  return (
    <div className={style.register_wrapper}>
      <form className={style.register_form} onSubmit={handleSubmit}>
        {/* <button
          onClick={() => {
            navigate("/echat/");
          }}
          className={style.return}
        >
          Back
        </button> */}
        <h2>Реєстрація</h2>
        <input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />

        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="user">Користувач</option>
          <option value="admin">Адмін</option>
        </select>

        <button type="submit">Зареєструватись</button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};
