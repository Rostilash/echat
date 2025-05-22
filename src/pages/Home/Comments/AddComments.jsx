import React, { useState } from "react";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import style from "./AddComments.module.css";

export const AddComments = ({ posts, setPosts, postId, currentUser }) => {
  const [commentValue, setCommentValue] = useState("");

  const handleAddComment = (postId) => {
    const newComment = {
      id: Date.now(),
      text: commentValue.trim(),
      timestamp: new Date().toISOString(),
      authorId: currentUser.uid,
      authorImg: currentUser.profileImage,
      likes: 0,
      likedBy: [],
      replies: [],
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setCommentValue("");
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

      <Button size="small" onClick={() => handleAddComment(postId)}>
        Коментувати
      </Button>
    </div>
  );
};
