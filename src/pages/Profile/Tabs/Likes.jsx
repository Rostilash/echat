import React from "react";
import style from "../Profile.module.css";
import { PostList } from "../../Home/PostList";

export const Likes = ({ posts, user, setPosts }) => {
  const likedPosts = (posts || []).filter((post) => user?.likes?.includes(post.id));

  if (likedPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного лайку ...</p>;
  }

  return (
    <div>
      <PostList posts={likedPosts} setPosts={setPosts} />
    </div>
  );
};
