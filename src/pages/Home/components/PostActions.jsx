import style from "./PostActions.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { Action } from "./Action";
import { getPostActionArray } from "../utils/postActionsArray";
import { handleLikePost } from "../../../utils/handleLikeItem";
import { handleBookmarkPost } from "./../../../utils/postActions/handleBookmarkPost";
import { handleRepostPost } from "./../../../utils/postActions/handleRepostPost";

export const PostActions = ({ post, posts, setPosts, setActiveCommentPostId, isOwner }) => {
  const { currentUser } = useAuth();

  // Likes
  const handleLike = (postId) => {
    handleLikePost({ postId, posts, currentUser, setPosts });
  };

  // Repost
  const handleRepost = (postId) => {
    handleRepostPost({ postId, posts, currentUser, setPosts });
  };

  // Bookmarks
  const handleBookmark = (postId) => {
    handleBookmarkPost({ postId, posts, currentUser, setPosts });
  };

  // Open Comment options
  const handleClickComment = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };

  //Array for our ActionButtons
  const actionButtons = getPostActionArray({
    post,
    currentUser,
    isOwner,
    handlers: {
      handleClickComment,
      handleLike,
      handleRepost,
      handleBookmark,
    },
  });

  return (
    <div className={style.message_actions}>
      <div className={style.message_icons}>
        {/* Loopping array for action buttons  */}
        {actionButtons.map(({ key, isActive, handleClick, activeImage, defaultImage, count }) => (
          <Action
            key={key}
            isActive={isActive}
            liked={post.userLiked}
            handleClick={handleClick}
            activeImage={activeImage}
            defaultImage={defaultImage}
            count={count}
          />
        ))}
      </div>
    </div>
  );
};
