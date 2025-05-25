import { useState } from "react";
import style from "./EditProfileForm.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import { ChangePasswordModal } from "../../ChangePasswordModal/ChangePasswordModal";
import { mergeUserData } from "../../../utils/mergeUserData";
import { useNavigate } from "react-router-dom";
import { LoaderSmall } from "./../../../components/Loader/LoaderSmall";
import { ImageUpload } from "./ImageUpload";

export const EditProfileForm = ({ setPosts }) => {
  // useContext our user
  const { currentUser, updateUserProfile, updateUser, deleteCurrentUser } = useAuth();

  const [fadeOut, setFadeOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    password: "",
    nickname: currentUser?.nickname || "",
    email: currentUser?.email || "",
    profileImage: currentUser?.profileImage || "",
    headerImage: currentUser?.headerImage || "",
    bio: currentUser?.bio || "",
    birthdate: currentUser?.birthdate || "",
    location: currentUser?.location || "",
    region: currentUser?.region || "",
    website: currentUser?.website || "",
  });

  if (!currentUser) {
    return (
      <div className="loader_center">
        <LoaderSmall />
      </div>
    );
  }
  const navigate = useNavigate();
  const { profileImage, headerImage, id: uid } = currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Очистити помилку при зміні поля
    setFormErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "nickname") {
      const allowed = /^[a-zA-Z0-9_]*$/;
      if (!allowed.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          nickname: "Можна вводити лише англійські букви, цифри та _",
        }));
        return;
      }
    }
    console.log(value);
    if (name === "name" && value.toLowerCase() === "сука") {
      setFormErrors((prev) => ({
        ...prev,
        name: "Сам ти такий :)",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const hasChanges = Object.keys(form).some((key) => {
      if (key === "password" && form[key] === "") return false;
      const formValue = form[key] ?? "";
      const currentValue = currentUser[key] ?? "";

      return formValue.toString().trim() !== currentValue.toString().trim();
    });
    console.log("form:", form);
    console.log("currentUser:", currentUser);

    if (!hasChanges) {
      setErrorMessage("Ви нічого не змінили");
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 200);
      setTimeout(() => {
        setErrorMessage(null);
        setFadeOut(false);
      }, 3100);
      return;
    }
    // for uniq nicknames
    if (!form.nickname || !/^[a-zA-Z0-9_]+$/.test(form.nickname)) {
      setErrorMessage("Нікнейм може містити лише латинські літери, цифри та символ _");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const nicknameTaken = users.some((user) => user.nickname === form.nickname && user.email !== currentUser.email);

    if (nicknameTaken) {
      newErrors.nickname = "Цей нікнейм вже зайнятий";
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Updating user data
    const updatedData = mergeUserData(currentUser, form);

    try {
      // If updateUserProfile async - wait function ends
      await updateUserProfile(updatedData, setPosts);

      setSuccessMessage("Профіль оновлено успішно");
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 200);
      setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setFadeOut(false);
      }, 3100);

      navigate(`/echat/profile/${encodeURIComponent(uid)}`);
    } catch (error) {
      setErrorMessage("Сталася помилка при оновленні профілю");
      console.error("Update user profile error:", error);
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Ім’я" },
    { name: "nickname", placeholder: "Нікнейм" },
    { name: "email", placeholder: "Email" },
    { name: "location", placeholder: "Місто" },
    { name: "region", placeholder: "Регіон" },
    { name: "website", placeholder: "Вебсайт" },
    { name: "birthdate", placeholder: "Дата народження", type: "date" },
  ];

  // need to change it later
  const handleDelete = async () => {
    const emailConfirmation = prompt("Для підтвердження введіть свій email:");

    if (!emailConfirmation) return;

    const confirmed = window.confirm("Ви впевнені, що хочете видалити обліковий запис? Цю дію не можна скасувати!");

    if (!confirmed) return;

    const { success, message } = await deleteCurrentUser(emailConfirmation);

    if (success) {
      alert("Обліковий запис успішно видалено.");
    } else {
      alert(`Помилка: ${message}`);
    }
  };

  return (
    <div className={style.profile}>
      <div className={style.userImages}>
        <div className={style.userProfileImage}>
          {/* load profile image */}
          <ImageUpload
            uploadKey="profileImage"
            maxSizeKB={50}
            currentUser={currentUser}
            image={profileImage}
            updateUser={updateUser}
            userUid={uid}
            iconPath="https://cdn-icons-png.flaticon.com/128/13407/13407013.png"
          />
        </div>
        {/* load header image */}
        <div className={style.userHeaderImage}>
          <ImageUpload
            uploadKey="headerImage"
            maxSizeKB={100}
            currentUser={currentUser}
            image={headerImage}
            updateUser={updateUser}
            userUid={uid}
            iconPath="https://cdn-icons-png.flaticon.com/128/13407/13407013.png"
          />
        </div>
      </div>

      {/* change Password */}
      <div className={style.passwordBlock} title="Змінити пароль">
        <Button onClick={() => setShowModal(true)}>Змінити пароль</Button>
        {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} setSuccessMessage={setSuccessMessage} />}
      </div>

      {/* User updating form */}
      <form className={style.form} onSubmit={handleSubmit} noValidate>
        {errorMessage && <p className={`error ${fadeOut ? "fadeOut" : ""}`}>{errorMessage}</p>}
        {successMessage && <p className={`success ${fadeOut ? "fadeOut" : ""}`}>{successMessage}</p>}

        {inputFields.map(({ name, placeholder, type = "text" }) => (
          <Input
            key={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            error={formErrors[name]}
            size="no_left_padding"
            border="bordRadLow"
          />
        ))}

        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Про себе" className={style.textarea} />

        <Button type="submit">Зберегти зміни</Button>
      </form>

      {/* delete Current user for testing */}
      <Button type="text" onClick={handleDelete}>
        Видалити Аккуант
      </Button>
    </div>
  );
};
