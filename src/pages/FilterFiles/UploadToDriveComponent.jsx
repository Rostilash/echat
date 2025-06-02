import React, { useState } from "react";
import JSZip from "jszip";
import { useAuth } from "../../hooks/useAuth";
import styles from "./UploadToDriveComponent.module.css";

export const UploadToDriveComponent = ({ selectedFiles }) => {
  const { uploadFileToDrive, signInWithGoogleDrive } = useAuth();

  const [accessToken, setAccessToken] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await signInWithGoogleDrive();
    if (res.success) {
      setAccessToken(res.accessToken);
      setMessage("Успішний вхід. Тепер натисніть 'Завантажити'.");
    } else {
      setMessage("Помилка входу в Google Drive: " + res.error.message);
    }
  };

  const handleUploadFiles = async () => {
    if (!selectedFiles?.length || !accessToken) {
      setMessage("Немає файлів або ви не увійшли.");
      return;
    }

    setMessage("Починаємо завантаження файлів...");
    for (const file of selectedFiles) {
      const res = await uploadFileToDrive(zipBlob, accessToken, "filtered_files.zip");
      if (res.success) {
        setMessage((prev) => prev + `\n✅ ${file.name} — Завантажено (ID: ${res.data.id})`);
      } else {
        setMessage((prev) => prev + `\n❌ ${file.name} — Помилка: ${res.error.message}`);
      }
    }
  };

  const handleUploadZip = async () => {
    if (!selectedFiles?.length || !accessToken) {
      setMessage("Немає файлів або ви не увійшли.");
      return;
    }

    setMessage("Створюємо ZIP архів...");

    const zip = new JSZip();
    selectedFiles.forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      zip.file(path, file);
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      setMessage("Завантажуємо ZIP архів на Google Drive...");

      const res = await uploadFileToDrive(content, accessToken, "filtered_files.zip");

      if (res.success) {
        setMessage(`✅ ZIP архів успішно завантажено! ID: ${res.data.id}`);
      } else {
        setMessage(`❌ Помилка завантаження ZIP: ${res.error.message}`);
      }
    } catch (error) {
      setMessage("Помилка створення ZIP архіву: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Завантажити до Google Drive</h2>

      <span>Для завантаження файлів в Google Drive вам потрібно пройти кожного разу авторизацію</span>
      <button onClick={handleLogin}>Увійти через Google Drive</button>
      <p className={styles.message} style={{ whiteSpace: "pre-line" }}>
        {message}
      </p>
      <br />
      <span>У вас є вибір як ви бажаєте завантажити файли у ваш Google Drive</span>
      <button onClick={handleUploadFiles}>Завантажити файли окремо</button>
      <button onClick={handleUploadZip}>Завантажити ZIP архів</button>
    </div>
  );
};
