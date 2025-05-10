import React from "react";
import { PostList } from "./../../Home/PostList";

export const Posts = ({ posts }) => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};
