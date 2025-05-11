import React, { useState, useContext } from "react";
import style from "./ChangePasswordModal.module.css";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "./../../components/Input/Input";
import { CloseButton } from "./../../components/Button/CloseButton";
import { Button } from "./../../components/Button/Button";

export const ChangePasswordModal = ({ onClose }) => {
  const { currentUser, changePassword, verifyOldPassword } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOldPassword = () => {
    const result = verifyOldPassword(currentUser.email, oldPassword);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    setStep(2); // go to next step
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Усі поля обов’язкові");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Усі поля обов’язкові");
      return;
    }

    if (newPassword.length < 6) {
      setError("Новий пароль має містити щонайменше 6 символів");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Пароль має містити хоча б одну велику літеру");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      9;
      setError("Пароль має містити хоча б одну малу літеру");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Пароль має містити хоча б одну цифру");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    const result = changePassword(currentUser.email, oldPassword, newPassword);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    onClose();
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <CloseButton onClose={onClose} />
        <h2>Зміна паролю</h2>
        {/* {error && <p className={style.error}>{error}</p>} */}

        {step === 1 ? (
          <>
            <Input
              type="password"
              placeholder="Введіть старий пароль"
              value={oldPassword}
              onChange={(e) => {
                setError("");
                setOldPassword(e.target.value);
              }}
              border="bordRadLow"
              size="no_left_padding"
              error={error}
            />
            <div className={style.buttons}>
              <Button onClick={handleVerifyOldPassword} variant="success">
                Підтвердити
              </Button>
            </div>
          </>
        ) : (
          <>
            <Input
              type="password"
              placeholder="Новий пароль"
              value={newPassword}
              onChange={(e) => {
                setError("");
                setNewPassword(e.target.value);
              }}
              border="bordRadLow"
              size="no_left_padding"
              error={error}
            />
            <Input
              type="password"
              placeholder="Підтвердіть новий пароль"
              value={confirmPassword}
              onChange={(e) => {
                setError("");
                setConfirmPassword(e.target.value);
              }}
              border="bordRadLow"
              size="no_left_padding"
              error={error}
            />

            <div className={style.buttons}>
              <Button onClick={handleChangePassword} variant="success">
                Змінити пароль
              </Button>
              {/* <Button onClick={onClose} variant="google">
                Скасувати
              </Button> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
