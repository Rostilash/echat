import style from "./PostActions.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { handleLikePost } from "../../../utils/handleLikeItem";

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
  // console.log(posts);

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

        <span
          className={style.icon_image}
          onClick={() => {
            handleRepost(post.id);
          }}
        >
          <img
            src={
              post.repostedBy && post.repostedBy.includes(currentUser?.email)
                ? "https://cdn-icons-png.flaticon.com/128/11289/11289820.png" // Icon for a repost post
                : "https://cdn-icons-png.flaticon.com/128/14385/14385249.png" // Standard repost icon
            }
            alt="icon"
          />
          <span>{post.reposts}</span>
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
