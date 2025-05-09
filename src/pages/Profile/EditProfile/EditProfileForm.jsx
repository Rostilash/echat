import React, { useState } from "react";
import style from "./EditProfileForm.module.css";
import { useTheme } from "../../../hooks/useTheme";
import { useAuth } from "../../../hooks/useAuth";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import { ChangePasswordModal } from "../../ChangePasswordModal/ChangePasswordModal";
import { compressImage } from "../../../utils/imageUtils";

export const EditProfileForm = () => {
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  // Auth hook functions
  const { currentUser, updateUser, changePassword } = useAuth();

  const nameLocalStore = currentUser?.name;
  const passwordLocalStore = currentUser?.password;
  const emailLocalStore = currentUser?.email;
  const profileImage = currentUser?.profileImage;

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const base64Image = await compressImage(file, 100); // Compress to 100KB

      // Get the current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Update the user's profile image
      const updatedUser = { ...currentUser, profileImage: base64Image };

      // Update the user in localStorage
      updateUser(updatedUser);

      // Update the posts, if it's the current user's post
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts = posts.map((post) => {
        // If this is the current user's post, update their profile image
        if (post.author.username === currentUser.email) {
          return {
            ...post,
            author: {
              ...post.author,
              profileImage: base64Image, // Update the profile image in the post
            },
          };
        }
        return post; // If the post doesn't belong to the user, leave it unchanged
      });

      // Update the posts in localStorage
      localStorage.setItem("posts", JSON.stringify(posts));
    } catch (err) {
      console.error("Помилка стиснення зображення", err);
      alert("Не вдалося обробити зображення.");
    }
  };

  return (
    <div className={style.profile}>
      <h1>Редагувати профіль</h1>

      <span className={style.user_image} onClick={() => document.getElementById("image-upload").click()}>
        <span className={style.user_image_upload_icon}>
          <img src="https://cdn-icons-png.flaticon.com/128/6538/6538673.png" alt="icon" />
        </span>
        {profileImage && <img src={profileImage} alt="Profile" />}
      </span>

      <h3>Вітаю, бажаєш змінити імя?</h3>

      <div className={style.themeSwitcher}>
        <button onClick={toggleTheme} className={style.themeButton}>
          {theme === "light" ? "🌙 Ніч" : "☀️ День"}
        </button>
      </div>

      <input id="image-upload" type="file" style={{ display: "none" }} onChange={handleImageUpload} />

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
