import style from "./PostActions.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { handleLikePost } from "../../../utils/handleLikeItem";
import { getPostActionArray } from "../utils/postActionsArray";
import { Action } from "./Action";

export const PostActions = ({ post, posts, setPosts, setActiveCommentPostId, isOwner }) => {
  const { currentUser, updatePost } = useAuth();

  // Likes
  const handleLike = (postId) => {
    handleLikePost({ postId, posts, currentUser, setPosts, updatePost });
  };

  // Repost
  const handleRepost = (postId) => {
    const hasRepost = currentUser.repostedBy.includes(postId);

    const updatedPosts = posts.map((post) => {
      // if not array we make an array
      if (post.id === postId) {
        const currentRepostedBy = Array.isArray(post.repostedBy) ? post.repostedBy : [];

        // if user made repost Email deleted else added
        const updatedRepostBy = hasRepost
          ? currentRepostedBy.filter((email) => email !== currentUser.email)
          : [...currentRepostedBy, currentUser.email];

        // if hasRepost=false add +1 else -1
        const updateRepposts = hasRepost ? (post.reposts || 1) - 1 : (post.reposts || 0) + 1;

        return {
          ...post,
          repostedBy: updatedRepostBy,
          reposts: updateRepposts,
        };
      }
      return post;
    });
    // update post from MainLoyout (refresh items on posts)
    setPosts(updatedPosts);

    // if hasRepost false return all id, if true take existing array and put postId into it.
    const updatedCurrentUser = hasRepost ? currentUser.repostedBy.filter((id) => id !== postId) : [...currentUser.repostedBy, postId];

    // put it into array
    const updateCurrentUser = {
      ...currentUser,
      repostedBy: updatedCurrentUser,
    };
    // save into user array
    updatePost(updateCurrentUser);
  };

  // Bookmarks
  const handleBookmark = (postId) => {
    const isBookmarked = currentUser.bookmarks.includes(postId);
    const updatedBookmarks = isBookmarked ? currentUser.bookmarks.filter((id) => id !== postId) : [...currentUser.bookmarks, postId];

    const existingPostIds = posts.map((p) => p.id);
    const validBookmarks = updatedBookmarks.filter((id) => existingPostIds.includes(id));

    const updatedCurrentUser = {
      ...currentUser,
      bookmarks: validBookmarks,
      updatedAt: new Date().toISOString(),
    };

    updatePost(updatedCurrentUser);
  };

  // Open Comment options
  const handleClickComment = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };

  // console.log(currentUser);

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
          <Action key={key} isActive={isActive} handleClick={handleClick} activeImage={activeImage} defaultImage={defaultImage} count={count} />
        ))}
      </div>
    </div>
  );
};
