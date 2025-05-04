import React, { useState } from "react";
import { Button } from "../../components/Button/Button";
// import style from "./Home.module.css";
import style from "./PostForm.module.css";
import { useAuth } from "../../hooks/useAuth";
import { compressImage } from "../../utils/imageUtils";

export const PostForm = ({ onCreatePost }) => {
  const { currentUser } = useAuth();
  const profileImage = currentUser?.profileImage;

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split("/")[0];

    if (fileType === "image" && !file.type.includes("gif")) {
      try {
        const compressedBase64 = await compressImage(file, 100);
        setImageFile(file);
        setImagePreview(compressedBase64); // тепер попередній перегляд — вже стиснений
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

  const handleSubmit = () => {
    if (!text.trim() && !imageFile && !gifPreview) return;

    const mediaData = gifPreview || imagePreview || null;
    onCreatePost(text, mediaData);
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setGifPreview(null);
  };

  return (
    <div className={style.home}>
      <div className={style.top_cart}>
        <div>
          <h3>Головна сторінка</h3>
        </div>
        <div>
          <span className={style.icon_image}>
            <img src="https://cdn-icons-png.flaticon.com/128/899/899531.png" alt="icon" />
          </span>
        </div>
      </div>

      <div className={style.bottom_cart}>
        <div className={style.user_image}>{profileImage && <img src={profileImage} alt="Profile" />}</div>
        <div className={style.user_info}>
          <div className={style.home_text}>
            <input type="text" placeholder="Що відбувається ?" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div className={style.home_actions}>
            <div className={style.icons}>
              <span className={style.icon_image} onClick={() => document.getElementById("image-upload").click()}>
                <img src="https://cdn-icons-png.flaticon.com/128/13123/13123917.png" alt="icon" />
              </span>
              <span className={style.icon_image}>
                <img src="https://cdn-icons-png.flaticon.com/128/11633/11633511.png" alt="icon" />
              </span>
              <span className={style.icon_image}>
                <img src="https://cdn-icons-png.flaticon.com/128/11846/11846979.png" alt="icon" />
              </span>
              <span className={style.icon_image}>
                <img src="https://cdn-icons-png.flaticon.com/128/1182/1182408.png" alt="icon" />
              </span>
            </div>
            {/* Hidden file input for image upload */}
            <input id="image-upload" type="file" style={{ display: "none" }} onChange={handleFileChange} />

            <div className={style.send_news}>
              <Button size="medium" onClick={handleSubmit}>
                Надіслати
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
