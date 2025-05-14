import style from "../Profile.module.css";
import { PostItem } from "../../Home/components/PostItem";

export const Posts = ({ post, posts, user, setPosts, currentUser, updatePost }) => {
  const userPosts = posts.filter((post) => post.author.email === user.email);

  if (userPosts.length === 0) {
    return <p className={style.no_posts_message}>Ви ще не створили жодного поста...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      {userPosts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updatePost={updatePost} />
      ))}
    </div>
  );
};
