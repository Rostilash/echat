import { useState, useRef, useEffect } from "react";
import style from "./PostDropdown.module.css";
import { Modal } from "../../../components/Modal/ModalConfirm";

export const PostDropdown = ({ onEdit, onDelete, item, currentUser, messageToDelate }) => {
  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const openModal = (id) => {
    setItemToDelete(id);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className={style.dropdown_wrapper} ref={dropdownRef}>
      <div className={style.post_edit_selection} onClick={toggleDropdown}>
        <img
          className={`${style.icon_transition} ${open ? style.icon_rotate : ""}`}
          src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png"
          alt="icon"
          style={{ height: "18px", width: "18px" }}
        />
      </div>

      {open && (
        <div className={style.dropdown_buttons}>
          {item.authorId === currentUser?.id && (
            <>
              {onEdit && <button onClick={onEdit}>Редагувати</button>}

              <button onClick={() => openModal(item.id)}>
                {/* <img src="https://cdn-icons-png.flaticon.com/128/17780/17780343.png" alt="delete" /> */}
                Видалити
              </button>
            </>
          )}
        </div>
      )}

      {itemToDelete && <Modal message={messageToDelate} onConfirm={() => onDelete(itemToDelete)} onCancel={() => setItemToDelete(null)} />}
    </div>
  );
};
