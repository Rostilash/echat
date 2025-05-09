export const handleLikeItem = (item, userEmail) => {
  const alreadyLiked = item.likedBy && item.likedBy.includes(userEmail);

  return {
    ...item,
    likes: alreadyLiked ? item.likes - 1 : item.likes + 1,
    likedBy: alreadyLiked ? item.likedBy.filter((email) => email !== userEmail) : [...(item.likedBy || []), userEmail],
  };
};
