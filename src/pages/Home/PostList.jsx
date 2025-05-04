import React, { useState, useRef, useEffect } from "react";
import style from "./Home.module.css";
import { timeAgo } from "./../../utils/timeAgo";
import { useAuth } from "../../hooks/useAuth";

export const PostList = ({ posts, setPosts }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { email: "guest@example.com" };
  const [visibleCount, setVisibleCount] = useState(5);
  const containerRef = useRef(null);

  // const handleLoadMore = () => {
  //   setVisibleCount((prev) => prev + 5);
  // };

  const handleLike = (postId) => {
    // Find the post the user wants to like or unlike
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        // If the user has already liked the post, remove the like
        if (post.likedBy && post.likedBy.includes(currentUser.email)) {
          return {
            ...post,
            likes: post.likes - 1, // Decrease the number of likes
            likedBy: post.likedBy.filter((email) => email !== currentUser.email), // Remove the email from the likedBy array
          };
        }

        // If the post hasn't been liked, increase the like count and add the user to the likedBy list
        return {
          ...post,
          likes: post.likes + 1, // Increase the number of likes
          likedBy: [...(post.likedBy || []), currentUser.email], // Add the user's email to the likedBy array
        };
      }
      return post; // If this is not the post, do not modify it
    });

    setPosts(updatedPosts); // Update the posts list in state
    localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Save the updated posts in localStorage
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const handleEditPost = (postId) => {
    // Logic to handle editing the post (e.g. open a modal with a form)
    const postToEdit = posts.find((post) => post.id === postId);
    console.log(postToEdit);
    // Here, you would likely want to update the post and save it back to localStorage
  };

  // Функція для обробки скролу
  const handleScroll = () => {
    const container = containerRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      setVisibleCount((prev) => Math.min(prev + 1, posts.length)); // Завантажуємо ще 5 постів
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const visiblePosts = posts.slice(0, visibleCount);
  console.log(posts);
  return (
    <div ref={containerRef} className={style.post_list_container}>
      {visiblePosts.map((post) => (
        <div key={post.id} className={style.messages}>
          <div className={style.bottom_cart}>
            <div className={style.user_image}>
              <img
                src={
                  post.author.email === currentUser.email
                    ? currentUser.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
                    : post.author.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"
                }
                alt="user"
              />
            </div>

            <div className={style.user_info}>
              <div className={style.messages_text}>
                <div className={style.user_name}>
                  <p>{post.author.name}</p>
                  <span>@{post.author.username}</span>
                  <div className={style.dot_wrapper}>
                    <span className={style.dot}>.</span>
                  </div>
                  <span>{timeAgo(post.timestamp)}</span>
                </div>
                <div>
                  <img src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png" alt="icon" style={{ height: "18px", width: "18px" }} />
                </div>
              </div>
              <div className={style.message_content}>
                <p>{post.text}</p>
                {post.media && post.id && <img src={post.media} alt="image" loading="lazy" />}
              </div>

              <div className={style.message_actions}>
                <div className={style.message_icons}>
                  <span className={style.icon_image}>
                    <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>{post.comments.length}</span>
                  </span>
                  <span className={style.icon_image}>
                    <img src="https://cdn-icons-png.flaticon.com/128/13951/13951393.png" alt="icon" /> <span>{post.reposts}</span>
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
                {/* Check if post belongs to the current user */}
                {post.author.username === currentUser.email && (
                  <div className={style.edit_delete_buttons}>
                    <button onClick={() => handleEditPost(post.id)}>Edit</button>
                    <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* {visibleCount < posts.length && (
        <div className={style.load_more}>
          <button onClick={handleLoadMore}>Показати ще</button>
        </div>
      )} */}
    </div>
  );
};
