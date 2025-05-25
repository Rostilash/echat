import React from "react";
import style from "./Button.module.css";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  size = "medium",
  position = "center",
  disabled,
  isLoading = false,
  ...props
}) => {
  const variantClass = style[variant] || style.default;
  const sizeClass = style[size] || style.medium;
  const positionClass = style[position] || style.center;

  return (
    <button
      className={`${style.sendButton} ${variantClass} ${sizeClass} ${positionClass}`}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
};
