import { addBookmark, removeBookmark, hasUserBookmarked } from "../../services/bookmarksService";

export const handleBookmarkPost = async ({ postId, posts, currentUser, setPosts }) => {
  const userId = currentUser.uid;
  const alreadyBookmarked = await hasUserBookmarked(postId, userId);

  if (alreadyBookmarked) {
    await removeBookmark(postId, userId);
  } else {
    await addBookmark(postId, userId);
  }

  const updatedUserBookmarks = alreadyBookmarked ? currentUser.bookmarks.filter((id) => id !== postId) : [...(currentUser.bookmarks || []), postId];

  currentUser.bookmarks = updatedUserBookmarks;

  setPosts([...posts]);
};
