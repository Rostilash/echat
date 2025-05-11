import React from "react";
import { PostList } from "./../../Home/PostList";
import style from "../Profile.module.css";

export const Posts = ({ userPosts, user }) => {
  if (userPosts.length === 0) {
    return <p className={style.no_posts_message}>Ви ще не створили жодного поста...</p>;
  }
  return (
    <div>
      <PostList posts={userPosts} />
    </div>
  );
};
