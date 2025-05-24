import { useState } from "react";
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
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

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
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${style.input} ${error ? style.errorInput : ""} ${sizeClass} ${borderRadius}`}
        {...props}
        required
      />

      {/* Eye icon */}
      {isPasswordType && (
        <div className={style.eyeIcon} onClick={() => setShowPassword((prev) => !prev)}>
          <img
            src={
              showPassword
                ? // Open
                  "https://cdn-icons-png.flaticon.com/128/4855/4855031.png"
                : // default
                  "https://cdn-icons-png.flaticon.com/128/8276/8276554.png"
            }
            alt="toggle visibility"
          />
        </div>
      )}

      {error && <p className={style.errorMessage}>{error}</p>}
    </div>
  );
};
