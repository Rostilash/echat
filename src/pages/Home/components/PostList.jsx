import { useState, useRef, useEffect } from "react";
import style from "../Home.module.css";
import { timeAgo } from "../../../utils/timeAgo";
import { useDropdown } from "../../../hooks/useDropdown";
import { Modal } from "../../../components/Modal/ModalConfirm";
import { Comments } from "../comments/Comments";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import { handleLikeItem } from "../../../utils/handleLikeItem";
import { deleteItemById } from "../../../utils/deleteItem";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";

export const PostList = ({ posts, setPosts }) => {
  const { currentUser, updatePost } = useAuth();
  const [visibleCount, setVisibleCount] = useState(10);
  const [deletingPostIds, setDeletingPostIds] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [zoomedImageId, setZoomedImageId] = useState(null);
  const [commentValue, setCommentValue] = useState("");

  const containerRef = useRef(null);

  const { openId: postOpenOptions, handleToggle: handleOpenSelection, dropdownRef, toggleRef } = useDropdown();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // Don't do anything if the ref is not yet set

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // like post
  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return handleLikeItem(post, currentUser.email);
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Update user's liked posts
    const updatedCurrentUser = {
      ...currentUser,
      likes: currentUser.likes.includes(postId) ? currentUser.likes : [...currentUser.likes, postId], // Add postId to likes if not already in the list
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedCurrentUser);
  };

  // delete post
  const handleDeletePost = () => {
    deleteItemById({
      items: posts,
      idToDelete: postToDelete,
      setItems: setPosts,
      setDeletingIds: setDeletingPostIds,
      storageKey: "posts",
      onFinish: () => setPostToDelete(null), // Hide modal
    });

    // Remove the post from the current user's posts
    const updatedCurrentUser = {
      ...currentUser,
      posts: currentUser.posts.filter((postId) => postId !== postToDelete),
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedCurrentUser);
  };

  // open confirmation modal
  const openModal = (postId) => {
    setPostToDelete(postId);
  };
  // cancel delete
  const cancelDelete = () => {
    setPostToDelete(null);
  };

  // edit post Working on it
  // const handleEditPost = (postId) => {
  //   // Logic to handle editing the post (e.g. open a modal with a form)
  //   const postToEdit = posts.find((post) => post.id === postId);
  //   console.log(postToEdit);
  //   // Here, you would likely want to update the post and save it back to localStorage
  // };

  // Scroll function
  const handleScroll = () => {
    const container = containerRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      setVisibleCount((prev) => Math.min(prev + 5, posts.length)); // add +5 post
    }
  };

  const visiblePosts = posts.slice(0, visibleCount);

  // comments
  const handleClickComment = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };

  const handleAddComment = (postId) => {
    const newComment = {
      id: Date.now(),
      text: commentValue.trim(),
      timestamp: new Date().toISOString(),
      author: {
        name: currentUser.name || "Guest",
        email: currentUser.email,
        nickname: currentUser.nickname || currentUser.id,
        profileImage: currentUser.profileImage || "",
      },
      likes: 0,
      likedBy: [],
      replies: [],
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Optional: track commented posts in user activity
    const updatedCurrentUser = {
      ...currentUser,
      posts: currentUser.posts.includes(postId) ? currentUser.posts : [...currentUser.posts, postId], // Add postId to posts if not already in the list
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedCurrentUser);

    setCommentValue(""); // Clear input
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

  // console.log(currentUser);
  if (!currentUser) {
    return (
      <div className="loader_center">
        <LoaderSmall />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={style.post_list_container}>
      {visiblePosts.map((post) => (
        <div key={post.id} className={`${style.messages} ${deletingPostIds.includes(post.id) ? style.deleting : ""}`}>
          <div className={style.bottom_cart}>
            <div className={style.user_image}>
              <Link to={`/echat/profile/${post?.author.nickname}`}>
                <img
                  src={
                    post.author.email === currentUser.email
                      ? currentUser.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
                      : post.author.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
                  }
                  alt="user"
                />
              </Link>
            </div>

            <div className={style.user_info}>
              <div className={style.messages_text}>
                <div className={style.user_name}>
                  <p>
                    {post.author.name}{" "}
                    <img src="https://cdn-icons-png.flaticon.com/128/7887/7887079.png" alt="icon" style={{ height: "12px", width: "12px" }} />
                  </p>
                  <span>@{post.author.nickname}</span>
                  <div className={style.dot_wrapper}>
                    <span className={style.dot}>.</span>
                  </div>
                  <span>{timeAgo(post.timestamp)}</span>
                </div>
                <div ref={toggleRef} onClick={(e) => handleOpenSelection(e, post.id)} className={style.post_edit_selection}>
                  <img
                    className={`${style.icon_transition} ${postOpenOptions === post.id ? style.icon_rotate : ""}`}
                    src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png"
                    alt="icon"
                    style={{ height: "18px", width: "18px" }}
                  />
                </div>
                {postOpenOptions === post.id && (
                  <div className={style.edit_delete_buttons} ref={dropdownRef}>
                    <button>Відкрити інформацію</button>
                    {post.author.email === currentUser.email && (
                      <>
                        {/* <button onClick={() => handleEditPost(post.id)}>Редагувати</button> */}
                        <button onClick={() => openModal(post.id)}>
                          <img src="https://cdn-icons-png.flaticon.com/128/17780/17780343.png" alt="delete" />
                          {"   "} Видалити
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className={style.message_content}>
                <p>{post.text}</p>

                {/* Post image */}
                {post.media && post.id && (
                  <img
                    src={post.media}
                    alt="image"
                    loading="lazy"
                    className={zoomedImageId === post.id ? style.zoomed : ""}
                    onClick={() => setZoomedImageId(zoomedImageId === post.id ? null : post.id)}
                  />
                )}
              </div>

              <div className={style.message_actions}>
                <div className={style.message_icons}>
                  <span className={style.icon_image} onClick={() => handleClickComment(post.id)}>
                    <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>{post.comments.length}</span>
                  </span>
                  <span className={style.icon_image} onClick={() => handleBookmark(post.id)}>
                    <img
                      src={
                        currentUser.bookmarks.includes(post.id)
                          ? "https://cdn-icons-png.flaticon.com/128/4208/4208443.png" // Active bookmark icon
                          : "https://cdn-icons-png.flaticon.com/128/13951/13951393.png" // Default bookmark icon
                      }
                      alt="bookmark"
                    />
                  </span>
                  <span className={style.icon_image} onClick={() => handleLike(post.id)}>
                    <img
                      src={
                        post.likedBy && post.likedBy.includes(currentUser.email)
                          ? "https://cdn-icons-png.flaticon.com/128/210/210545.png" // Icon for a liked post
                          : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" // Standard like icon
                      }
                      alt="icon"
                    />
                    <span>{post.likes}</span>
                  </span>
                  <span className={style.icon_image}>
                    <img src="https://cdn-icons-png.flaticon.com/128/18166/18166719.png" alt="icon" />
                  </span>
                </div>
              </div>

              {/* Показати коментарі  */}
              {activeCommentPostId === post.id && post.comments && (
                <div className={style.comments_item}>
                  <div className={style.add_comment_block}>
                    <Input
                      value={commentValue}
                      onChange={(e) => setCommentValue(e.target.value)}
                      placeholder="Написати коментар"
                      size="comment"
                      border="bordRadLow"
                    />

                    <Button size="small" onClick={() => handleAddComment(post.id)}>
                      Коментувати
                    </Button>
                  </div>

                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <Comments key={comment.id} comment={comment} currentUser={currentUser} posts={posts} setPosts={setPosts} postId={post.id} />
                    ))
                  ) : (
                    <p className={style.no_comments_text}>Коментарі відсутні...</p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Modal success window */}
          {postToDelete === post.id && (
            <Modal message="Ви впевнені, що хочете видалити цей пост?" onConfirm={handleDeletePost} onCancel={cancelDelete} />
          )}
        </div>
      ))}
    </div>
  );
};
