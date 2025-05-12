import React from "react";
import style from "../Profile.module.css";
import { PostList } from "../../Home/components/PostList";

export const Media = ({ posts, user }) => {
  const mediaPosts = (posts || []).filter((post) => post.author.email === user.email && post.media);

  if (mediaPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного медіа...</p>;
  }

  return (
    <div>
      <PostList posts={mediaPosts} />
    </div>
  );
};
