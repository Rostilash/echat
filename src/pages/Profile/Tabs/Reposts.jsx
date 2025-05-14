import style from "../Profile.module.css";
import { PostItem } from "../../Home/components/PostItem";

export const Reposts = ({ posts, user, setPosts, currentUser, updatePost }) => {
  const userReposts = (posts || []).filter((post) => user?.repostedBy?.includes(post.id));

  if (userReposts.length === 0) {
    return <p className={style.no_posts_message}>Ви ще не створили жодного поста...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      {userReposts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updatePost={updatePost} />
      ))}
    </div>
  );
};
