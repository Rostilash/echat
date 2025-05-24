import { useState } from "react";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import style from "./AddComments.module.css";
import { createComment } from "../../../services/commentsService";

export const AddComments = ({ setPosts, postId, currentUser }) => {
  const [commentValue, setCommentValue] = useState("");

  const handleAddComment = async () => {
    if (!commentValue.trim() || !currentUser?.id) return;

    try {
      const commentData = {
        postId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorNickname: currentUser.nickname,
        authorImg: currentUser.profileImage,
        text: commentValue.trim(),
      };

      // Створюємо коментар у Firebase
      const newCommentId = await createComment(commentData);

      // Формуємо локальну копію з реальною id
      const newComment = {
        ...commentData,
        id: newCommentId,
        createdAt: new Date().toISOString(),
        likes: [],
        replies: [],
      };

      // Додаємо локально в стейт у відповідний пост
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
              }
            : post
        )
      );

      // Очищуємо поле вводу
      setCommentValue("");
    } catch (error) {
      console.error("Не вдалося додати коментар:", error);
    }
  };

  return (
    <div className={style.add_comment_block}>
      <Input
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        placeholder="Написати коментар"
        size="comment"
        border="bordRadLow"
      />

      <Button size="small" onClick={handleAddComment}>
        Коментувати
      </Button>
    </div>
  );
};
