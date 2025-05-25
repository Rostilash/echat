import { useState } from "react";
import { compressImage } from "../utils/imageUtils";

export const useImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);

  const handleLoadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split("/")[0];

    if (fileType === "image" && !file.type.includes("gif")) {
      try {
        const compressedBase64 = await compressImage(file, 100);
        setImageFile(file);
        setImagePreview(compressedBase64);
      } catch (err) {
        console.error("Помилка при стисненні зображення:", err);
      }
    } else if (file.type.includes("gif")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setGifPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Будь ласка, завантажте зображення або gif-файл.");
    }
  };

  const clearPreviews = () => {
    setImageFile(null);
    setImagePreview(null);
    setGifPreview(null);
  };

  const addGifPreview = (url) => {
    setGifPreview(url);
    setImageFile(null);
    setImagePreview(null);
  };

  return {
    imageFile,
    imagePreview,
    gifPreview,
    handleLoadImage,
    addGifPreview,
    clearPreviews,
  };
};
