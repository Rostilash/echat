export const handleLikeItem = (item, userEmail) => {
  const alreadyLiked = item.likedBy && item.likedBy.includes(userEmail);

  return {
    ...item,
    likes: alreadyLiked ? item.likes - 1 : item.likes + 1,
    likedBy: alreadyLiked ? item.likedBy.filter((email) => email !== userEmail) : [...(item.likedBy || []), userEmail],
  };
};

export const handleLikePost = ({ postId, posts, currentUser, setPosts, updateUser }) => {
  const hasLiked = currentUser.likes.includes(postId);

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      const currentLikedBy = Array.isArray(post.likedBy) ? post.likedBy : [];

      const updatedLikedBy = hasLiked ? currentLikedBy.filter((email) => email !== currentUser.email) : [...currentLikedBy, currentUser.email];

      const updatedLikes = hasLiked ? post.likes - 1 : (post.likes || 0) + 1;

      return {
        ...post,
        likedBy: updatedLikedBy,
        likes: updatedLikes,
      };
    }
    return post;
  });

  setPosts(updatedPosts);
  localStorage.setItem("posts", JSON.stringify(updatedPosts));

  const updatedLikesArray = hasLiked ? currentUser.likes.filter((id) => id !== postId) : [...currentUser.likes, postId];

  const existingPostIds = updatedPosts.map((p) => p.id);
  const validLikes = updatedLikesArray.filter((id) => existingPostIds.includes(id));

  const updatedCurrentUser = {
    ...currentUser,
    likes: validLikes,
    updatedAt: new Date().toISOString(),
  };

  updateUser(updatedCurrentUser);
};
