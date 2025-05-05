// hooks/useDropdown.js
import { useState, useEffect, useRef } from "react";

export const useDropdown = () => {
  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  const handleToggle = (event, id) => {
    event.stopPropagation();
    setOpenId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && toggleRef.current && !toggleRef.current.contains(event.target)) {
        setOpenId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return {
    openId,
    setOpenId,
    handleToggle,
    dropdownRef,
    toggleRef,
  };
};
