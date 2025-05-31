import React, { useState } from "react";
import ignore from "ignore";
import style from "./CompressFiles.module.css";

export const CompressFiles = () => {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [ignoreRules, setIgnoreRules] = useState(``);
  const [inputKey, setInputKey] = useState(0);
  const [isInverted, setIsInverted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Assets/Fishing Village URP/3D Objects/**/*.assbin
  const handleFileChange = async (e) => {
    setLoading(true);
    setInputKey(0);
    setUploadFiles([]);

    setTimeout(() => {
      const files = Array.from(e.target.files);
      const normalizedRules = ignoreRules
        .split("\n")
        .map((rule) => rule.trim())
        .filter(Boolean)
        .map((rule) => rule.replace(/\/{2,}/g, "/"))
        .join("\n");

      const ig = ignore().add(normalizedRules);

      const filtered = files.filter((file) => {
        const rawPath = file.webkitRelativePath || file.name;
        const path = rawPath.replace(/\/{2,}/g, "/");
        return isInverted ? ig.ignores(path) : !ig.ignores(path);
      });

      setUploadFiles(filtered);
      setLoading(false);
      setInputKey((prev) => prev + 1);
    }, 0);
  };

  const handleInverce = () => {
    setIsInverted((prev) => !prev);
  };

  const totalSize = uploadFiles.reduce((acc, file) => acc + file.size, 0);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "tga", "webp"].includes(ext)) return "🖼️";
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "🎞️";
    if (["mp3", "wav", "ogg"].includes(ext)) return "🎵";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "🗜️";
    if (["pdf"].includes(ext)) return "📄";
    if (["txt", "md", "log"].includes(ext)) return "📜";
    if (["js", "ts", "jsx", "tsx", "html", "css", "json"].includes(ext)) return "💻";
    return "📁";
  };

  return (
    <div className={style.container}>
      <div className={style.modal}>
        <div className={style.formSection}>
          <button onClick={handleInverce}>{!isInverted ? "Додати" : "Відняти"}</button>
          <h2>{!isInverted ? "Віднімання Елементів" : "Додавання Елементів"}</h2>
          <textarea
            rows={6}
            value={ignoreRules}
            onChange={(e) => setIgnoreRules(e.target.value)}
            placeholder="Правила для завантаження файлів тут ...
          "
          />
          <input key={inputKey} type="file" webkitdirectory="true" directory="" multiple onChange={handleFileChange} />
        </div>

        <div className={style.filesSection}>
          {loading && (
            <div className={style.loader}>
              <img src="https://media.tenor.com/0chWb5VggvAAAAAM/pizzaninjas-pizza-ninjas.gif" alt="" />
            </div>
          )}

          {uploadFiles.length > 0 && (
            <>
              <p>
                Загальний розмір: <strong>{formatBytes(totalSize)}</strong>
              </p>
              <ul>
                {uploadFiles.map((file, index) => (
                  <li key={index}>
                    <span className={style.fileIcon}>{getFileIcon(file.name)}</span>
                    {file.webkitRelativePath || file.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
