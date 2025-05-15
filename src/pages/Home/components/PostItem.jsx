import style from "./PostItem.module.css";
import { useState } from "react";
import { PostActions } from "./PostActions";
import { PostDropdown } from "./PostDropdown";
import { PostImage } from "./PostImage";
import { AddComments } from "../comments/AddComments";
import { Comments } from "../comments/Comments";
import { UserImage } from "./UserImage";
import { PostHeader } from "./PostHeader";

export const PostItem = ({ post, posts, setPosts, currentUser, updateUser }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const isOwner = post?.author.nickname === currentUser?.nickname;

  // delete post
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      const updatedPosts = posts.filter((p) => p.id !== post.id);
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }, 300);
  };

  return (
    <div className={`${style.post} ${isDeleting ? style.fadeOut : ""}`}>
      {/* Header (name,image,nickname,time) */}
      <div className={style.post_header}>
        <UserImage post={post} currentUser={currentUser} />

        <PostHeader post={post} />

        {/* Drop down menu */}
        {isOwner && (
          <PostDropdown
            onDelete={handleDelete}
            item={post}
            currentUser={currentUser}
            isOwner={isOwner}
            messageToDelate="Ви впевнені, що хочете видалити цей пост?"
          />
        )}
      </div>

      <div className={style.post_content}>
        {/* Post text */}
        <div className={style.message_content}>
          <p>{post.text}</p>
        </div>

        {/* Post image */}
        {post.media && post.id && <PostImage post={post} />}
      </div>

      {/* Actions: likes. comments, bookmarks */}
      <PostActions post={post} posts={posts} setPosts={setPosts} setActiveCommentPostId={setActiveCommentPostId} isOwner={isOwner} />

      {/* Show comments  */}
      {activeCommentPostId === post.id && post.comments && (
        <div className={style.comments_item}>
          <AddComments posts={posts} setPosts={setPosts} updateUser={updateUser} postId={activeCommentPostId} currentUser={currentUser} />

          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Comments
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                post={post}
                posts={posts}
                setPosts={setPosts}
                postId={post.id}
                isOwner={isOwner}
              />
            ))
          ) : (
            <p className={style.no_comments_text}>Коментарі відсутні...</p>
          )}
        </div>
      )}
    </div>
  );
};
