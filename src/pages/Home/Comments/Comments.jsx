import style from "./Comment.module.css";
import { useState, useEffect } from "react";
import { Button } from "../../../components/Button/Button";
import { UserImage } from "../components/UserImage";
import { PostHeader } from "../components/PostHeader";
import { PostDropdown } from "../components/PostDropdown";
import { Action } from "../components/Action";
import { Input } from "../../../components/Input/Input";
import { deleteComment, toggleLikeComment } from "../../../services/commentsService";
import { addReplyToComment } from "./../../../services/commentsService";

export const Comments = ({ currentUser, comment, posts, setPosts, postId, commentId }) => {
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [prevAuthorInfo, setPrevAuthorInfo] = useState(comment.text);
  const [answerText, setAnswerText] = useState("");

  const updateCommentInPost = (commentId, updateFn) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = post.comments.map((c) => (c.id === commentId ? updateFn(c) : c));

        return { ...post, comments: updatedComments };
      })
    );
  };

  const handleLikeComment = async () => {
    try {
      const toggled = await toggleLikeComment(comment.id, currentUser.uid);

      updateCommentInPost(comment.id, (c) => {
        const updatedLikes = toggled ? [...c.likes, currentUser.uid] : c.likes.filter((uid) => uid !== currentUser.uid);

        return { ...c, likes: updatedLikes, userLikedComment: toggled };
      });
    } catch (err) {
      console.error("Помилка при лайку коментаря:", err);
    }
  };

  const handleDeleteComment = async (id) => {
    console.log(id);

    try {
      await deleteComment(id);

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter((c) => c.id !== id),
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Видалення коментаря не вдалося ");
    }
  };

  // const handleAnswerComment = (commentData) => {
  //   setActiveCommentId((prevId) => (prevId === commentData.id ? null : commentData.id));
  //   setPrevAuthorInfo(commentData);
  // };

  // const handleUpdateAnswerContext = async (commentId) => {
  //   if (commentId !== prevAuthorInfo.id) return;
  //   if (!answerText.trim()) return;

  //   const reply = {
  //     text: answerText,
  //     authorId: currentUser?.uid,
  //     authorName: currentUser?.name,
  //     authorNickname: currentUser?.nickname,
  //     authorImg: currentUser?.profileImage,
  //     prevAuthorName: prevAuthorInfo.authorName,
  //     prevAuthorText: prevAuthorInfo.text,
  //   };

  //   try {
  //     console.log("start");
  //     // update fireBase
  //     await addReplyToComment(commentId, reply);
  //     console.log("over");
  //     // update local
  //     updateCommentInPost(commentId, (comment) => ({
  //       ...comment,
  //       replies: [...(comment.replies || []), { ...reply, commentId: Date.now(), createdAt: new Date().toISOString() }],
  //     }));

  //     setAnswerText("");
  //     setActiveCommentId(null);
  //   } catch (error) {
  //     console.log("Помилка при відправці відповіді", error);
  //   }
  // };

  // const comentLikedUser = comment.likes.includes(currentUser.uid);

  console.log(posts[0].comments);
  return (
    <div className={style.comment} style={{ borderBottom: "1px solid var(--border-color)" }}>
      <div className={style.comment_header}>
        <UserImage author={comment} />
        <PostHeader timeStamp={comment?.createdAt} author={comment} />
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
        <Action
          handleClick={handleLikeComment}
          // isActive={comentLikedUser}
          defaultImage="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
          activeImage="https://cdn-icons-png.flaticon.com/128/210/210545.png"
          // count={comment.likes.length}
          // hidenUsers={comentLikedUser ? comment.authorName : false}
        />

        <span className={style.icon_image}>
          {!activeCommentId ? (
            <Button onClick={() => handleAnswerComment(comment)} size="small" variant="secondary">
              Відповісти
            </Button>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateAnswerContext(commentId);
                }}
              >
                <span>{prevAuthorInfo.authorName} </span>
                <span>{prevAuthorInfo.text} </span>
                <Input value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
                <Button type="submit" size="small" variant="secondary">
                  Підтвердити
                </Button>
                <Button onClick={() => handleAnswerComment(comment.id)} size="small" variant="secondary">
                  Відмінити
                </Button>
              </form>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
