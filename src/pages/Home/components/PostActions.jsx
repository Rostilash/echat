import style from "./PostActions.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { handleLikeItem } from "../../../utils/handleLikeItem";

export const PostActions = ({ post, posts, setPosts, setActiveCommentPostId, isOwner }) => {
  const { currentUser, updatePost, updateUser } = useAuth();

  // Likes
  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return handleLikeItem(post, currentUser.email);
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Update user likes
    const hasLiked = currentUser.likes.includes(postId);
    const updatedLikes = hasLiked
      ? currentUser.likes.filter((id) => id !== postId) // if didn`t liked -1 like
      : [...currentUser.likes, postId]; // or like +1

    //Filter posts if they where deleted
    const remainingPostIds = updatedPosts.map((p) => p.id);
    const finalLikes = updatedLikes.filter((likedPostId) => remainingPostIds.includes(likedPostId));

    // Update posts in array
    const updatedCurrentUser = {
      ...currentUser,
      likes: finalLikes, // save if likes where really clicked
      updatedAt: new Date().toISOString(),
    };

    // Update users & currentUser localstorage
    updatePost(updatedCurrentUser);
  };

  // add for bookmarks
  const handleBookmark = (postId) => {
    const isBookmarked = currentUser.bookmarks.includes(postId);
    const updatedBookmarks = isBookmarked ? currentUser.bookmarks.filter((id) => id !== postId) : [...currentUser.bookmarks, postId];

    const updatedCurrentUser = {
      ...currentUser,
      bookmarks: updatedBookmarks,
      updatedAt: new Date().toISOString(),
    };

    updatePost(updatedCurrentUser);
  };

  // open Comment options
  const handleClickComment = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };

  console.log(currentUser);
  console.log(posts);
  return (
    <div className={style.message_actions}>
      <div className={style.message_icons}>
        <span className={style.icon_image} onClick={() => handleClickComment(post.id)}>
          <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>{post.comments.length}</span>
        </span>

        <span className={style.icon_image} onClick={() => handleLike(post.id)}>
          <img
            src={
              post.likedBy && post.likedBy.includes(currentUser?.email)
                ? "https://cdn-icons-png.flaticon.com/128/210/210545.png" // Icon for a liked post
                : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" // Standard like icon
            }
            alt="icon"
          />
          <span>{post.likes}</span>
        </span>
        <span className={style.icon_image} onClick={() => handleBookmark(post.id)}>
          <img
            src={
              currentUser?.bookmarks.includes(post.id)
                ? "https://cdn-icons-png.flaticon.com/128/4942/4942550.png" // Active bookmark icon
                : "https://cdn-icons-png.flaticon.com/128/3983/3983871.png" // Default bookmark icon
            }
            alt="bookmark"
          />
        </span>

        {/* hide for currentUser */}
        {!isOwner && (
          <span className={style.icon_image}>
            <img src="https://cdn-icons-png.flaticon.com/128/18166/18166719.png" alt="icon" />
          </span>
        )}
      </div>
    </div>
  );
};
