import { useState } from "react";
import style from "./PostItem.module.css";
import { createPortal } from "react-dom";

export const PostImage = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!post.media || post.media.length === 0) return null;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className={style.post_image}>
      <img src={post.media} alt="image" loading="lazy" onClick={handleOpen} className={style.thumbnail} />

      {/* modal for full picture */}
      {isOpen &&
        createPortal(
          <div className={style.modal} onClick={handleClose}>
            <img src={post.media} alt="full size" className="modal_image" />
          </div>,
          document.body
        )}
    </div>
  );
};
