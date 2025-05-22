import style from "./Comment.module.css";
import { handleLikeItem } from "../../../utils/handleLikeItem";
import { Button } from "../../../components/Button/Button";
import { UserImage } from "../components/UserImage";
import { PostHeader } from "../components/PostHeader";
import { PostDropdown } from "../components/PostDropdown";

export const Comments = ({ currentUser, comment, post, posts, setPosts, postId }) => {
  const handleLikeComment = () => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.map((c) => (c.id === comment.id ? handleLikeItem(c, currentUser.email) : c));
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleDeleteComment = (id) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter((c) => c.id !== id);
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  return (
    <div className={style.comment} style={{ borderBottom: "1px solid var(--border-color)" }}>
      <div className={style.comment_header}>
        <UserImage author={currentUser} />
        <PostHeader post={post} />
      </div>

      {/* Drop down */}
      {comment.authorId === currentUser.uid && (
        <PostDropdown
          onDelete={() => handleDeleteComment(comment.id)}
          item={comment}
          currentUser={currentUser}
          messageToDelate="Ви впевнені, що хочете видалити цей коментар?"
        />
      )}

      <div className={style.comment_content}>
        {/* comment TEXT */}
        <p>{comment.text}</p>
      </div>

      <div className={style.comment_actions}>
        <span className={style.icon_image} onClick={handleLikeComment}>
          <img
            src={
              comment.likedBy && comment.likedBy.includes(currentUser.email)
                ? "https://cdn-icons-png.flaticon.com/128/210/210545.png"
                : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
            }
            alt="icon"
          />
          {"  "}
          <span>{comment.likes || 0}</span>
        </span>
        <span className={style.icon_image}>
          <Button size="small" variant="secondary">
            Відповісти
          </Button>
        </span>
      </div>
    </div>
  );
};
