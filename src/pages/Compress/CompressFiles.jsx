import React, { useState } from "react";
import style from "./CompressFiles.module.css";

export const CompressFiles = () => {
  const [uploadFiles, setuploadFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setuploadFiles(files);
  };

  return (
    <div className={style.container}>
      <div className={style.modal}>
        <input type="file" webkitdirectory="true" directory="" multiple onChange={handleFileChange} />
        {uploadFiles.length > 0 && (
          <ul>
            {uploadFiles.map((file, index) => (
              <li key={index}>{file.webkitRelativePath || file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
