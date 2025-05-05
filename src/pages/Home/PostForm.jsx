import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button/Button";
import style from "./PostForm.module.css";
import { useAuth } from "../../hooks/useAuth";
import { compressImage } from "../../utils/imageUtils";
import EmojiPicker from "emoji-picker-react";

export const PostForm = ({ onCreatePost }) => {
  const { currentUser } = useAuth();
  const profileImage = currentUser?.profileImage;

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const pickerRef = useRef(null);
  const gifRef = useRef(null);
  const emojiIconRef = useRef(null);
  const gifIconRef = useRef(null);

  //close emoji & gif window dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && emojiIconRef.current && !emojiIconRef.current.contains(event.target)) {
        setShowPicker(false);
      }

      if (gifRef.current && !gifRef.current.contains(event.target) && gifIconRef.current && !gifIconRef.current.contains(event.target)) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // load image on project.
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

  // Throw Data to our LocalStorage with onCreatePost
  const handleSubmit = () => {
    if (!text.trim() && !imageFile && !gifPreview) return;

    const mediaData = gifPreview || imagePreview || null;
    onCreatePost(text, mediaData); // this one
    // refresh
    setText("");
    setImageFile(null);
    setImagePreview(null);
    setGifPreview(null);
  };

  // Add emoji into input
  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
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
          {(imagePreview || gifPreview) && (
            <div className={style.preview_block}>
              <div className={style.preview_content}>
                <img src={imagePreview || gifPreview} alt="Preview" className={style.preview_image} />
                <button
                  className={style.remove_button}
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setGifPreview(null);
                  }}
                >
                  ✖
                </button>
              </div>
            </div>
          )}
          <div className={style.home_actions}>
            <div className={style.icons}>
              {/* photo icon */}
              <span className={style.icon_image} onClick={() => document.getElementById("image-upload").click()}>
                <img src="https://cdn-icons-png.flaticon.com/128/13123/13123917.png" alt="icon" />
              </span>
              {/* gif icon */}
              <span
                ref={gifIconRef}
                className={style.icon_image}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGifPicker((prev) => !prev);
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/11633/11633511.png" alt="icon" />
              </span>
              {/* question icon */}
              <span className={style.icon_image}>
                <img src="https://cdn-icons-png.flaticon.com/128/11846/11846979.png" alt="icon" />
              </span>
              {/* smile icon */}
              <span
                ref={emojiIconRef}
                className={style.icon_image}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPicker((prev) => !prev);
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/1182/1182408.png" alt="icon" />
              </span>
            </div>

            {/* gif block */}
            {showGifPicker && (
              <div ref={gifRef} className={style.gif_picker_container}>
                <input
                  type="text"
                  placeholder="Вставте посилання на GIF"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setGifPreview(e.target.value); // вставка GIF через URL
                      setShowGifPicker(false);
                    }
                  }}
                />
                <p>Натисніть Enter для додавання</p>
              </div>
            )}

            {/* Emoji block */}
            {showPicker && (
              <div ref={pickerRef} className={style.emoji_block}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}

            {/* Hidden file input for image upload */}
            <input id="image-upload" type="file" style={{ display: "none" }} onChange={handleLoadImage} />

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
