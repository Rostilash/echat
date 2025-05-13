import style from "./ImageUpload.module.css";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { useState } from "react";
import { compressImage } from "../../../utils/imageUtils";

export const ImageUpload = ({ uploadKey = "profileImage", maxSizeKB = 100, image, updateUser, iconPath }) => {
  const [uploading, setUploading] = useState(false);
  const [successUpload, setSuccessUpload] = useState(null);
  const [errorUpload, setErrorUpload] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setSuccessUpload(null);
    setErrorUpload(null);

    try {
      const base64Image = await compressImage(file, maxSizeKB);

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const updatedUser = { ...currentUser, [uploadKey]: base64Image };

      updateUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update posts if needed
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts = posts.map((post) =>
        post.author.email === currentUser.email
          ? {
              ...post,
              author: {
                ...post.author,
                [uploadKey]: base64Image,
              },
            }
          : post
      );

      localStorage.setItem("posts", JSON.stringify(posts));
      setSuccessUpload("Успішно!");
    } catch (err) {
      console.error("Помилка стиснення зображення", err);
      setErrorUpload("Не вдалося обробити зображення");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setSuccessUpload(null);
        setErrorUpload(null);
      }, 2000);
    }
  };

  return (
    <>
      <span className={style.user_image} title="Завантажити нове зображення" onClick={() => document.getElementById(`upload-${uploadKey}`).click()}>
        <span className={style.user_image_upload_icon}>
          {/* icon can go here */}
          {iconPath && <img src={iconPath} alt="Завантажити" />}
        </span>

        {image && <img src={image} alt="Uploaded preview" />}
      </span>

      <input id={`upload-${uploadKey}`} type="file" style={{ display: "none" }} onChange={handleImageUpload} />

      {uploading && (
        <div className="loader_center">
          <LoaderSmall />
        </div>
      )}
      {successUpload && <p className="success">{successUpload}</p>}
      {errorUpload && <p className="error">{errorUpload}</p>}
    </>
  );
};
