import React, { useState } from "react";
import style from "./Home.module.css";
import { timeAgo } from "./../../utils/timeAgo";
import { useAuth } from "../../hooks/useAuth";

export const PostList = () => {
  const [posts, setPosts] = useState(JSON.parse(localStorage.getItem("posts")) || []);
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { email: "guest@example.com" };

  const handleLike = (postId) => {
    // Знайдемо пост, на який користувач хоче поставити або зняти лайк
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        // Якщо користувач вже поставив лайк, знімаємо лайк
        if (post.likedBy && post.likedBy.includes(currentUser.email)) {
          return {
            ...post,
            likes: post.likes - 1, // Зменшуємо кількість лайків
            likedBy: post.likedBy.filter((email) => email !== currentUser.email), // Видаляємо email з масиву likedBy
          };
        }

        // Якщо лайк не був поставлений, збільшуємо лічильник лайків і додаємо користувача в список лайкнувших

        return {
          ...post,
          likes: post.likes + 1, // Збільшуємо кількість лайків
          likedBy: [...(post.likedBy || []), currentUser.email], // Додаємо email користувача в масив likedBy
        };
      }
      return post; // Якщо це не той пост, не змінюємо його
    });

    setPosts(updatedPosts); // Оновлюємо список постів у стані
    localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Зберігаємо оновлені пости в localStorage
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className={style.messages}>
          <div className={style.bottom_cart}>
            <div className={style.user_image}>
              <img src={post.author.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"} alt="user" />
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
                {post.id && <img src={post.media} alt="image" />}
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
                          ? "https://cdn-icons-png.flaticon.com/128/210/210545.png" // Іконка для лайкнутого посту
                          : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" // Стандартна іконка лайка
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
