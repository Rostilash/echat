import { PostItem } from "../../Home/components/PostItem";
import style from "../Profile.module.css";

export const Media = ({ posts, user, setPosts, currentUser, updatePost }) => {
  const mediaPosts = (posts || []).filter((post) => post.author.email === user.email && post.media);

  if (mediaPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного медіа...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      {mediaPosts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updatePost={updatePost} />
      ))}
    </div>
  );
};
