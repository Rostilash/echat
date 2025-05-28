import { addLike, removeLike, hasUserLiked } from "../services/likesService";

export const handleLikePost = async ({ postId, posts, currentUser, setPosts }) => {
  const userId = currentUser.uid;
  try {
    const alreadyLiked = await hasUserLiked(postId, userId);

    if (alreadyLiked) {
      await removeLike(postId, userId);
    } else {
      await addLike(postId, userId);
    }

    const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, likes: (post.likes || 0) + (alreadyLiked ? -1 : 1) } : post));

    setPosts(updatedPosts);
  } catch (error) {
    console.error("Error updating like:", error);
  }
};
