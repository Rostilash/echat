import style from "../Profile.module.css";
import { PostItem } from "../../Home/components/PostItem";

export const Likes = ({ posts, user, setPosts, currentUser, updatePost }) => {
  const likedPosts = (posts || []).filter((post) => user?.likes?.includes(post.id));

  if (likedPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного лайку ...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      {likedPosts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updatePost={updatePost} />
      ))}
    </div>
  );
};
