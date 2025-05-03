import React, { useState, useContext } from "react";
import style from "./ChangePasswordModal.module.css";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "./../../components/Input/Input";
import { CloseButton } from "./../../components/Button/CloseButton";
import { Button } from "./../../components/Button/Button";

export const ChangePasswordModal = ({ onClose }) => {
  const { currentUser, changePassword } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOldPassword = () => {
    const result = changePassword(currentUser.email, oldPassword, oldPassword); // check for old password

    if (!result.success && result.message === "Старий пароль невірний") {
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
              {/* <Button onClick={onClose} variant="google">
                Скасувати
              </Button> */}
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
              <Button onClick={handleVerifyOldPassword} variant="success">
                Підтвердити
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
