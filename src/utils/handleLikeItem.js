import { addLike, removeLike, hasUserLiked } from "../services/likesService";

export const handleLikePost = async ({ postId, posts, currentUser, setPosts }) => {
  const userId = currentUser.uid;
  const alreadyLiked = await hasUserLiked(postId, userId);

  if (alreadyLiked) {
    await removeLike(postId, userId);
  } else {
    await addLike(postId, userId);
  }

  const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + (alreadyLiked ? -1 : 1) } : post));

  setPosts(updatedPosts);
};

export const handleLikeItem = (item, userEmail) => {
  const alreadyLiked = item.likedBy && item.likedBy.includes(userEmail);

  return {
    ...item,
    likes: alreadyLiked ? item.likes - 1 : item.likes + 1,
    likedBy: alreadyLiked ? item.likedBy.filter((email) => email !== userEmail) : [...(item.likedBy || []), userEmail],
  };
};
