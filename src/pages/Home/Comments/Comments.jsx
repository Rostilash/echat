import { useState } from "react";
import style from "../Home.module.css";
import { timeAgo } from "../../../utils/timeAgo";
import { handleLikeItem } from "../../../utils/handleLikeItem";
import { useDropdown } from "../../../hooks/useDropdown";
import { Button } from "../../../components/Button/Button";
import { Modal } from "../../../components/Modal/ModalConfirm";

export const Comments = ({ currentUser, comment, posts, setPosts, postId }) => {
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  // console.log(currentUser);
  // console.log(comment);

  const { openId: commentOpenOptions, handleToggle: handleOpenCommentOptions, dropdownRef, toggleRef } = useDropdown();

  const handleLikeComment = () => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((c) => (c.id === comment.id ? handleLikeItem(c, currentUser.email) : c));
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const openDeleteCommentModal = (id) => {
    setCommentIdToDelete(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setCommentIdToDelete(null);
  };

  const handleDeleteComment = () => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter((c) => c.id !== commentIdToDelete);
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    setShowModal(false);
    setCommentIdToDelete(null);
  };

  return (
    <div className={style.messages} style={{ borderBottom: "1px solid var(--border-color)" }}>
      <div className={style.bottom_cart}>
        <div className={style.user_image}>
          <img
            src={
              comment.author.email === currentUser.email
                ? currentUser.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
                : comment.author.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
            }
            alt="user"
          />
        </div>

        <div className={style.user_info}>
          <div className={style.messages_text}>
            <div className={style.user_name}>
              <p>
                {comment.author.name}{" "}
                <img src="https://cdn-icons-png.flaticon.com/128/7887/7887079.png" alt="icon" style={{ height: "12px", width: "12px" }} />
              </p>
              <span>@{comment.author.email} </span>
              <div className={style.dot_wrapper}>
                <span className={style.dot}>.</span>
              </div>
              <span>{timeAgo(comment.timestamp)}</span>
            </div>

            <div className={style.post_edit_selection} ref={toggleRef} onClick={(e) => handleOpenCommentOptions(e, comment.id)}>
              <img
                className={`${style.icon_transition} ${commentOpenOptions === comment.id ? style.icon_rotate : ""}`}
                src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png"
                alt="icon"
                style={{ height: "18px", width: "18px" }}
              />

              {commentOpenOptions === comment.id && (
                <>
                  {comment.author.email === currentUser.email && (
                    <div className={style.edit_delete_buttons} ref={dropdownRef}>
                      <button onClick={() => openDeleteCommentModal(comment.id)}>Видалити</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className={style.message_content}>
            {/* comment TEXT */}
            <p>{comment.text}</p>
          </div>

          <div className={style.message_actions}>
            <div className={style.message_icons}>
              <span className={style.icon_image} onClick={handleLikeComment}>
                <img
                  src={
                    comment.likedBy && comment.likedBy.includes(currentUser.email)
                      ? "https://cdn-icons-png.flaticon.com/128/210/210545.png"
                      : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
                  }
                  alt="icon"
                />
                <span>{comment.likes || 0}</span>
              </span>
              <span className={style.icon_image}>
                <Button size="small" variant="secondary">
                  Відписати
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
      {showModal && <Modal message="Ви впевнені, що хочете видалити цей коментар?" onConfirm={handleDeleteComment} onCancel={cancelDelete} />}
    </div>
  );
};
