import React, { useState } from "react";
import JSZip from "jszip";
import ignore from "ignore";
import style from "./CompressFiles.module.css";
import { UploadToDriveComponent } from "./UploadToDriveComponent";

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

      const expandedRules = normalizedRules
        .split("\n")
        .flatMap((rule) => {
          const regexMatch = rule.match(/^\/?\[([A-Za-z])([A-Za-z])\](.+)/);
          if (regexMatch) {
            const lower = regexMatch[1].toLowerCase() + regexMatch[3];
            const upper = regexMatch[1].toUpperCase() + regexMatch[3];
            return [lower, upper];
          }
          return [rule];
        })
        .join("\n");

      const ig = ignore().add(expandedRules);

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

  const handleSaveFiles = async () => {
    if (uploadFiles.length === 0) return;

    const zip = new JSZip();

    uploadFiles.forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      zip.file(path, file);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_files.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={style.container}>
      <div className={style.modal}>
        <div className={style.formSection}>
          <div style={{ border: "1px solid grey", padding: "10px" }}>
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
            <button onClick={handleSaveFiles}>Зберегти відібрані файли (.zip)</button>
          </div>
          <div style={{ border: "1px solid grey" }}>
            <h2>Тестування з отриманням Auth 2.0 з google та додавання у свій disk</h2>
            <UploadToDriveComponent />
          </div>
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
