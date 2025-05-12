import React from "react";
import style from "../Profile.module.css";
import { PostList } from "../../Home/components/PostList";

export const Bookmarks = ({ posts, user }) => {
  const bookmarksPosts = (posts || []).filter((post) => user?.bookmarks?.includes(post.id));

  if (bookmarksPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного репосту...</p>;
  }

  return (
    <div>
      <PostList posts={bookmarksPosts} />
    </div>
  );
};
