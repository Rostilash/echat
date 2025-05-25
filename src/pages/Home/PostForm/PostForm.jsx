import style from "./PostForm.module.css";
import { useRef, useState } from "react";
import { Button } from "../../../components/Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import { EmojiPickerWrapper } from "../../../components/EmojiPickerWrapper/EmojiPickerWrapper";
import { GifPicker } from "./components/GifPicker";
import { ImagePreview } from "./../../../components/ImagePreview/ImagePreview";
import { UserImage } from "./../components/UserImage";
import { PostFormHeader } from "./components/PostFormHeader";
import { InputField } from "./components/InputField";
import { Action } from "../components/Action";
import { useImageUpload } from "../../../hooks/useImageUpload";

export const PostForm = ({ onCreatePost, selectedFilter }) => {
  const { currentUser } = useAuth();

  const [text, setText] = useState("");
  const { imageFile, imagePreview, gifPreview, handleLoadImage, clearPreviews, addGifPreview } = useImageUpload();

  const [showPicker, setShowPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  // made for closing the action icons
  const emojiIconRef = useRef(null);
  const gifIconRef = useRef(null);

  // fixes with click outside
  const handleEmojiToggle = (e) => {
    e.stopPropagation();
    setShowPicker((prev) => {
      if (!prev) setShowGifPicker(false); // if emoji is not open, close gif
      return !prev;
    });
  };

  // fixes with click outside
  const handleGifToggle = (e) => {
    e.stopPropagation();
    setShowGifPicker((prev) => {
      if (!prev) setShowPicker(false); // if gif is not open, close emoji
      return !prev;
    });
  };

  // Throw Data to our LocalStorage with onCreatePost
  const handleSubmit = () => {
    if (!text.trim() && !imageFile && !gifPreview) return;

    const mediaData = gifPreview || imagePreview || null;

    const intervalId = setInterval(() => {
      onCreatePost(text, mediaData); // this one make post
      //clear interval
      clearInterval(intervalId);
    }, 300);

    // refresh
    setText("");

    clearPreviews();
  };

  // Add emoji into input field
  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className={style.home}>
      <PostFormHeader selectedFilter={selectedFilter} />

      <div className={style.bottom_cart}>
        <UserImage author={currentUser} />

        <div className={style.user_info}>
          {/* main post text */}
          <InputField text={text} handleSubmit={handleSubmit} setText={setText} />

          {(imagePreview || gifPreview) && <ImagePreview src={imagePreview || gifPreview} onRemove={clearPreviews} />}

          <div className={style.home_actions}>
            {/* Actions */}
            <div className={style.icons}>
              {/* photo icon */}
              <Action
                handleClick={() => document.getElementById("image-upload").click()}
                defaultImage={"https://cdn-icons-png.flaticon.com/128/13123/13123917.png"}
              />

              {/* gif icon */}
              <Action ref={gifIconRef} handleClick={handleGifToggle} defaultImage={"https://cdn-icons-png.flaticon.com/128/11633/11633511.png"} />

              {/* question icon need to update it latter for options*/}
              {/* <Action defaultImage={"https://cdn-icons-png.flaticon.com/128/11846/11846979.png"} /> */}

              {/* smile icon */}
              <Action ref={emojiIconRef} handleClick={handleEmojiToggle} defaultImage={"https://cdn-icons-png.flaticon.com/128/1182/1182408.png"} />
            </div>

            {/* Emoji block */}
            {showPicker && <EmojiPickerWrapper visible={showPicker} onEmojiClick={onEmojiClick} onClose={() => setShowPicker(false)} />}

            {/* Hidden file input for image upload */}
            <input id="image-upload" type="file" style={{ display: "none" }} onChange={handleLoadImage} />

            <div className={style.send_news}>
              <Button size="medium" onClick={handleSubmit}>
                Надіслати
              </Button>
            </div>
          </div>

          {/* Gif block */}
          {showGifPicker && <GifPicker visible={showGifPicker} onAddGif={(url) => addGifPreview(url)} onClose={() => setShowGifPicker(false)} />}
        </div>
      </div>
    </div>
  );
};
