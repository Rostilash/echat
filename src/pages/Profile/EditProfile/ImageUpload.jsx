import { useState, useEffect } from "react";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { compressImage } from "../../../utils/imageUtils";

export const ImageUpload = ({ uploadKey = "profileImage", userUid, currentUser, updateUser }) => {
  const [uploading, setUploading] = useState(false);
  const [errorUpload, setErrorUpload] = useState(null);
  const [successUpload, setSuccessUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(currentUser?.[uploadKey] || null);

  // Synchronize imageUrl with currentUser from props
  useEffect(() => {
    setImageUrl(currentUser?.[uploadKey] || null);
  }, [currentUser, uploadKey]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorUpload(null);
    setSuccessUpload(null);

    try {
      const base64Image = await compressImage(file, 50);

      const updatedUser = { ...currentUser, [uploadKey]: base64Image };
      await updateUser(updatedUser);

      setImageUrl(base64Image);
      setSuccessUpload("Зображення успішно оновлено!");
    } catch (err) {
      console.error("Помилка при оновленні зображення:", err);
      setErrorUpload("Не вдалося завантажити зображення");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setSuccessUpload(null);
        setErrorUpload(null);
      }, 2500);
    }
  };

  const DEFAULT_HEADER_IMAGE = "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=60";
  const DEFAULT_AVATAR_IMAGE = "https://www.gravatar.com/avatar/?d=mp&f=y";
  const isHeader = uploadKey === "headerImage";
  const defaultImage = isHeader ? DEFAULT_HEADER_IMAGE : DEFAULT_AVATAR_IMAGE;

  return (
    <>
      <label style={{ cursor: "pointer" }} title="Завантажити зображення">
        <img src={imageUrl || defaultImage} alt="Завантажити" />
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
      </label>

      {uploading && (
        <div className="loader_center">
          <LoaderSmall />
        </div>
      )}

      {successUpload && (
        <span style={{ color: "var(--echat-color-agree)", position: "absolute", top: "-20px", left: "0px", minWidth: "240px" }}>{successUpload}</span>
      )}
      {errorUpload && (
        <span style={{ color: "var(--echat-color-false)", position: "absolute", top: "-20px", left: "0px", minWidth: "280px" }}>{errorUpload}</span>
      )}
    </>
  );
};
