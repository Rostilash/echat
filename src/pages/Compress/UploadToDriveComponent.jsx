import React, { useState } from "react";
import { useAuth } from "./../../hooks/useAuth";
import styles from "./UploadToDriveComponent.module.css";

export const UploadToDriveComponent = () => {
  const { uploadFileToDrive, signInWithGoogleDrive } = useAuth();

  const [file, setFile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await signInWithGoogleDrive();
    if (res.success) {
      setAccessToken(res.accessToken);
      setMessage("Успішний вхід. Тепер оберіть файл для завантаження.");
    } else {
      setMessage("Помилка входу в Google Drive: " + res.error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Очистити повідомлення при виборі нового файлу
  };

  const handleUpload = async () => {
    if (!file || !accessToken) {
      setMessage("Оберіть файл та увійдіть у Google Drive.");
      return;
    }
    const res = await uploadFileToDrive(file, accessToken);
    if (res.success) {
      setMessage(`Файл завантажено успішно! ID: ${res.data.id}`);
    } else {
      setMessage("Помилка завантаження: " + res.error.message);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleLogin}>Увійти через Google Drive</button>
      <p className={styles.message}>{message}</p>
      <br />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Завантажити на Google Drive</button>
    </div>
  );
};
