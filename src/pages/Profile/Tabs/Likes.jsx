import { useUserPostInteractions } from "../../../hooks/useUserPostInteractions";
import { PostItem } from "../../Home/components/PostItem";

export const Likes = ({ posts, setPosts, user, currentUser, updateUser }) => {
  const { postIds: likedPostIds, loading } = useUserPostInteractions({
    collectionName: "postLikes",
    userId: user?.uid,
  });

  const likedPosts = posts.filter((post) => likedPostIds.includes(post.id));

  if (loading) return <p>Завантаження лайків...</p>;
  if (likedPosts.length === 0) return <p>Немає лайканих постів.</p>;

  return likedPosts.map((post) => (
    <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updateUser={updateUser} />
  ));
};
