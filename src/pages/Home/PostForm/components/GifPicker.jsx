import { useRef, useEffect, useState } from "react";
import style from "./GifPicker.module.css";

export const GifPicker = ({ visible, onAddGif, onClose }) => {
  const gifRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (gifRef.current && !gifRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  if (!visible) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onAddGif(inputValue);
      setInputValue("");
      onClose();
    }
  };

  return (
    <div ref={gifRef} className={style.gif_picker_container}>
      <input
        type="text"
        placeholder="Вставте посилання на GIF"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p>Натисніть Enter для додавання</p>
    </div>
  );
};
