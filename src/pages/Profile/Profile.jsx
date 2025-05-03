import React, { useState } from "react";
import style from "./Profile.module.css";
import { useTheme } from "./../../hooks/useTheme";
import { useAuth } from "./../../hooks/useAuth";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { ChangePasswordModal } from "./../ChangePasswordModal/ChangePasswordModal";

export const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  // Auth hook functions
  const { currentUser, setCurrentUser, updateUser, changePassword } = useAuth();

  const nameLocalStore = currentUser?.name;
  const passwordLocalStore = currentUser?.password;
  const emailLocalStore = currentUser?.email;

  const [nameValue, setNameValue] = useState({ name: nameLocalStore, password: "" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNameValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickChangeName = () => {
    if (!nameValue.name || nameValue.name === nameLocalStore) {
      setErrorMessage(`Ви нічого не змінили`);
      return;
    }
    const updatedData = { ...currentUser, name: nameValue.name };

    updateUser(updatedData);
    setErrorMessage(null);
  };

  const handlePasswordChange = () => {
    const result = changePassword(currentUser.email, passwordLocalStore, nameValue.password);
    console.log("clicked");
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
    }
  };

  return (
    <div className={style.profile}>
      <h1>Редагувати профіль</h1>
      <h3>Вітаю, бажаєш змінити імя?</h3>
      <div className={style.themeSwitcher}>
        <button onClick={toggleTheme} className={style.themeButton}>
          {theme === "light" ? "🌙 Ніч" : "☀️ День"}
        </button>
      </div>

      <div className={style.change_user_info}>
        <h3 style={{ color: "red" }}>{errorMessage}</h3>
        <Input
          type="name"
          name="name"
          value={nameValue.name || nameLocalStore}
          placeholder={nameLocalStore}
          onChange={handleChange}
          border="bordRadLow"
          size="no_left_padding"
        />
        <Button size="medium" onClick={handleClickChangeName}>
          Змінити
        </Button>
      </div>
      <div>
        <h3>Змінити пароль?</h3>
        <Button onClick={() => setShowModal(true)}>Змінити пароль</Button>

        {showModal && (
          <ChangePasswordModal onClose={() => setShowModal(false)} onChangePassword={handlePasswordChange} setSuccessMessage={setSuccessMessage} />
        )}
      </div>
    </div>
  );
};
