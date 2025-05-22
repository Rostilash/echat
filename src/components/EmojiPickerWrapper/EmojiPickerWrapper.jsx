import { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import style from "./EmojiPickerWrapper.module.css";

export const EmojiPickerWrapper = ({ visible, onEmojiClick, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div ref={pickerRef} className={style.emoji_block}>
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
};
