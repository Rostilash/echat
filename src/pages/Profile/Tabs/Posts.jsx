import React from "react";
import style from "../Profile.module.css";
import { PostList } from "../../Home/components/PostList";

export const Posts = ({ userPosts, setPosts }) => {
  if (userPosts.length === 0) {
    return <p className={style.no_posts_message}>Ви ще не створили жодного поста...</p>;
  }
  return (
    <div>
      <PostList posts={userPosts} setPosts={setPosts} />
    </div>
  );
};
