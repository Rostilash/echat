import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/config";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { compressImage } from "../../../utils/imageUtils";

export const ImageUpload = ({ uploadKey = "profileImage", userUid, currentUser, updateUser }) => {
  const [uploading, setUploading] = useState(false);
  const [successUpload, setSuccessUpload] = useState(null);
  const [errorUpload, setErrorUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(currentUser?.[uploadKey] || null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.size === 0) {
      setErrorUpload("Файл порожній або некоректний");
      return;
    }

    setUploading(true);
    setSuccessUpload(null);
    setErrorUpload(null);

    try {
      // 1. Compress
      const base64Image = await compressImage(file, 50);

      // 2. Change base64 into Blob
      // const res = await fetch(base64Image);
      // const blob = await res.blob();

      // 3. Create uniq path
      const imageRef = ref(storage, `users/${userUid}/${uploadKey}-${Date.now()}.jpg`);

      // Blob if in FireBase or file
      // 4. Download Blob from Firebase Storage
      // await uploadBytes(imageRef, file);

      // 5. We get URL file.
      // const downloadURL = await getDownloadURL(imageRef);

      // 6. Update user in Firestore (AFTER getting CORS downloadURL)
      const updatedUser = { ...currentUser, [uploadKey]: base64Image };
      // await updateUser(updatedUser);

      // 7. hesh URL local in state state
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      // downloadUrl here after CORS
      setImageUrl(base64Image);
      setSuccessUpload("Зображення успішно завантажено!");
    } catch (err) {
      console.error("Помилка завантаження:", err);
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
      <label style={{ cursor: "pointer" }}>
        {(imageUrl || DEFAULT_HEADER_IMAGE) && <img src={imageUrl || defaultImage} alt="Завантажити" />}
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
      </label>

      {uploading && (
        <div className="loader_center">
          <LoaderSmall />
        </div>
      )}
      {successUpload && <p style={{ color: "green" }}>{successUpload}</p>}
      {errorUpload && <p style={{ color: "red" }}>{errorUpload}</p>}
    </>
  );
};
