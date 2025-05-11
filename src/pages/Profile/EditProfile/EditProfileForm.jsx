import React, { useState } from "react";
import style from "./EditProfileForm.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import { ChangePasswordModal } from "../../ChangePasswordModal/ChangePasswordModal";
import { compressImage } from "../../../utils/imageUtils";
import { mergeUserData } from "../../../utils/mergeUserData";
import { useNavigate } from "react-router-dom";

export const EditProfileForm = () => {
  // useContext our user
  const { currentUser, updateUser } = useAuth();
  const [fadeOut, setFadeOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
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
  const { profileImage } = currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nickname") {
      const allowed = /^[a-zA-Z0-9_]*$/;
      if (!allowed.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(form).some((key) => form[key]?.trim() && form[key] !== currentUser[key]);

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

    if (!/^[a-zA-Z0-9_]+$/.test(form.nickname)) {
      setErrorMessage("Нікнейм може містити лише латинські літери, цифри та символ _");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const nicknameTaken = users.some((user) => user.nickname === form.nickname && user.email !== currentUser.email);

    if (nicknameTaken) {
      setErrorMessage("Цей нікнейм вже зайнятий");
      return;
    }

    //Save old userData info of user
    const updatedData = mergeUserData(currentUser, form);
    //update User
    updateUser(updatedData);

    setSuccessMessage("Профіль оновлено успішно");
    setFadeOut(false);

    setTimeout(() => {
      setFadeOut(true);
    }, 200);

    setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
      setFadeOut(false);
    }, 3100);

    navigate(`/echat/profile/${encodeURIComponent(form.nickname)}`);
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
      {/* Аватар */}
      <div className={style.imageSection}>
        <span className={style.user_image} onClick={() => document.getElementById("image-upload").click()}>
          <span className={style.user_image_upload_icon}>
            <img src="https://cdn-icons-png.flaticon.com/128/6538/6538673.png" alt="icon" />
          </span>
          {profileImage && <img src={profileImage} alt="Profile" />}
        </span>
        <input id="image-upload" type="file" style={{ display: "none" }} onChange={handleImageUpload} />
      </div>

      {/* Пароль */}
      <div className={style.passwordBlock}>
        <Button onClick={() => setShowModal(true)}>Змінити пароль</Button>
        {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} setSuccessMessage={setSuccessMessage} />}
      </div>

      <form className={style.form} onSubmit={handleSubmit} noValidate>
        {errorMessage && <p className={`error ${fadeOut ? "fadeOut" : ""}`}>{errorMessage}</p>}
        {successMessage && <p className={`success ${fadeOut ? "fadeOut" : ""}`}>{successMessage}</p>}

        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ім’я"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="Нікнейм"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Місто"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="region"
          value={form.region}
          onChange={handleChange}
          placeholder="Регіон"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Вебсайт"
          error={errorMessage}
          size="no_left_padding"
          border="bordRadLow"
        />
        <Input
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          placeholder="Дата народження"
          type="date"
          size="no_left_padding"
          border="bordRadLow"
        />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Про себе" className={style.textarea} />

        <Button type="submit">Зберегти зміни</Button>
      </form>
    </div>
  );
};
