import React, { useState } from "react";
import style from "./Input.module.css";

export const Input = ({
  name,
  type = "text",
  placeholder = "Введіть свої данні",
  value = "",
  onChange,
  error,
  icon,
  showIcon = true,
  focusIcon,
  size,
  border,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const sizeClass = style[size] || style.default;
  const borderRadius = style[border] || style.default;

  return (
    <div className={style.inputWrapper}>
      {showIcon && icon && (
        <span className={style.icon}>
          <img src={isFocused && focusIcon ? focusIcon : icon} alt={`${name}-icon`} />
        </span>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${style.input} ${error ? style.errorInput : ""} ${sizeClass} ${borderRadius}`}
        required
      />

      {error && <p className={style.errorMessage}>{error}</p>}
    </div>
  );
};
