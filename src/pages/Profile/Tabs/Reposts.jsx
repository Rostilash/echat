import style from "../Profile.module.css";
import { PostItem } from "../../Home/components/PostItem";
import { useUserPostInteractions } from "../../../hooks/useUserPostInteractions";

export const Reposts = ({ posts, user, setPosts, updatePost }) => {
  const { postIds: bookmarkedIds, loading } = useUserPostInteractions({
    collectionName: "postReposts",
    userId: user?.uid,
  });

  const userReposts = (posts || []).filter((post) => bookmarkedIds.includes(post.id));

  if (loading) return <p>Завантаження репостів...</p>;
  if (userReposts.length === 0) {
    return <p className={style.no_posts_message}>Ви ще не створили жодного репоста...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      {userReposts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={user} updatePost={updatePost} />
      ))}
    </div>
  );
};
