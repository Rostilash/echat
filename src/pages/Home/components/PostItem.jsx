import style from "./PostItem.module.css";
import { useState, useEffect } from "react";
import { PostActions } from "./PostActions";
import { PostDropdown } from "./PostDropdown";
import { PostImage } from "./PostImage";
import { AddComments } from "../comments/AddComments";
import { Comments } from "../comments/Comments";
import { UserImage } from "./UserImage";
import { PostHeader } from "./PostHeader";
import { useAuth } from "../../../hooks/useAuth";
import { deletePost, fetchPosts, updatePost } from "../../../services/postsService";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";

export const PostItem = ({ post, posts, setPosts, loading }) => {
  const { currentUser, isOwner, findUserByUid } = useAuth();
  // function of owner id (boolian)
  const owner = isOwner(post.authorId);

  // Actions
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  // find the user by authorId from Firestore
  const [postAuthor, setPostAuthor] = useState(null);
  useEffect(() => {
    if (post?.authorId) {
      findUserByUid(post.authorId).then(setPostAuthor);
    }
  }, [post]);

  // Delete post
  const handleDelete = async () => {
    setIsDeleting(true);
    //put some time to delete the post
    setTimeout(async () => {
      await deletePost(post.id);
      const updatedPosts = await fetchPosts();
      setPosts(updatedPosts);
    }, 300);
  };

  // Save post text into state
  const handleSaveEdit = async () => {
    await updatePost(post.id, { text: editText });
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
    setIsEditing(false);
  };

  // Open edit post message
  const handleOpenModal = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className={`${style.post} ${isDeleting ? style.fadeOut : ""}`}>
      {/* Header (name,image,nickname,time) */}
      <div className={style.post_header}>
        <UserImage author={postAuthor} />

        <PostHeader timeStamp={post.timestamp} author={postAuthor} />

        {/* Dropdown menu */}
        {!isEditing && (
          <PostDropdown
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            item={post}
            currentUser={currentUser}
            isOwner={owner}
            messageToDelate="Ви впевнені, що хочете видалити цей пост?"
          />
        )}
      </div>

      {/* body */}
      <div className={style.post_content}>
        {/* Post text */}
        {isEditing ? (
          <div className={style.message_content}>
            <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
            <div className={style.buttons}>
              <Button onClick={() => handleSaveEdit()} type="submit" size="small" variant="secondary">
                Підтвердити
              </Button>
              <Button onClick={() => setIsEditing(false)} size="small" variant="secondary">
                Відмінити
              </Button>
            </div>
          </div>
        ) : (
          <div className={style.message_content}>
            <p>{post.text}</p>
          </div>
        )}

        {/* Post image */}
        {post.media && post.id && <PostImage post={post} />}
      </div>

      {/* Actions: likes, comments, bookmarks */}
      <PostActions post={post} posts={posts} setPosts={setPosts} setActiveCommentPostId={setActiveCommentPostId} isOwner={owner} />

      {/* Show comments  */}
      {activeCommentPostId === post.id && (
        <div className={style.comments_item}>
          <AddComments posts={posts} setPosts={setPosts} postId={activeCommentPostId} currentUser={currentUser} />

          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id}>
                <Comments comment={comment} currentUser={currentUser} posts={posts} setPosts={setPosts} postId={post.id} />
              </div>
            ))
          ) : (
            <p className={style.no_comments_text}>Коментарі відсутні...</p>
          )}
        </div>
      )}
    </div>
  );
};
