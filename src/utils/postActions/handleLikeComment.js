// need to change in future!
export const handleLikeComment = async ({ commentId, comments, currentUser, setComments }) => {
  const userId = currentUser.uid;
  const alreadyLiked = await hasUserLikedComment(commentId, userId);

  if (alreadyLiked) {
    await unlikeComment(commentId, userId);
  } else {
    await likeComment(commentId, userId);
  }

  const updatedComments = comments.map((comment) =>
    comment.id === commentId
      ? {
          ...comment,
          likes: alreadyLiked ? comment.likes.filter((id) => id !== userId) : [...(comment.likes || []), userId],
          userLikedComment: !alreadyLiked,
        }
      : comment
  );

  setComments(updatedComments);
};
