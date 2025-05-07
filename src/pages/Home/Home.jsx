import React, { useState, useEffect } from "react";
import style from "./Home.module.css";
import { PostForm } from "./PostForm";
import { useAuth } from "../../hooks/useAuth";
import { PostList } from "./PostList";

export const Home = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    if (saved) return JSON.parse(saved);

    //Default State
    return [
      {
        id: "1",
        text: "Я роблю один і той же знімок двічі. Спочатку серцем, потім камерою",
        media:
          "https://images.unsplash.com/photo-1745450432714-f403f3fac945?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        timestamp: new Date().toISOString(),
        likes: 23,
        reposts: 5,
        comments: [],
        author: {
          name: "Avity",
          username: "@sktch_ComedyFan",
          profileImage: "https://yt3.ggpht.com/cBjl6YDbv6639q6ELLETZhW3nOqAUhWIr9cx4fHUKjrmhs2YcfiHQ9KkNgGHU_psIfdw_aSt=s88-c-k-c0x00ffffff-no-rj",
        },
      },
      {
        id: "2",
        text: "ARTISTIC RESIDENCY LIVE SESSION We bring the vibes you need Loading in progress… . Follow. Message. MADD's profile picture.",
        media:
          "https://images.unsplash.com/photo-1745800227130-f61ca9d6bcb1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
        timestamp: new Date().toISOString(),
        likes: 123,
        reposts: 50,
        comments: [],
        author: {
          name: "Aloha Vibes",
          username: "@Vach_Cana",
          profileImage: "https://yt3.ggpht.com/SmANtx6ituy1f16EKHUruhfal5oXhW8FhWVBb9oxvqAZ1oVDYnWlF8GfiiIyS2JC7G9bYlYqiA=s68-c-k-c0x00ffffff-no-rj",
        },
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  function extractTags(text) {
    if (!text) return [];
    const matches = text.match(/#[\p{L}\p{N}_]+/gu);
    return matches ? matches.map((tag) => tag.toLowerCase()) : [];
  }

  function detectScheduledDate(text) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

    const lowercaseText = text.toLowerCase();

    if (lowercaseText.includes("завтра")) {
      return formatDate(tomorrow);
    }

    // Можна розширити перевірку на інші слова, напр. "08 травня" тощо
    // Для цього треба парсити текст і порівнювати з реальними датами

    return null; // Якщо немає згадки про майбутнє
  }

  //Function for creating a new post
  const handleCreatePost = (text, mediaData) => {
    const scheduledDate = detectScheduledDate(text);

    const newPost = {
      id: Date.now().toString(),
      text,
      media: mediaData,
      timestamp: new Date().toISOString(),
      likes: 0,
      reposts: 0,
      region: "Україна",
      comments: [],
      tags: extractTags(text),
      scheduledFor: scheduledDate,
      author: {
        name: currentUser.name,
        username: currentUser.username || currentUser.email,
        profileImage: currentUser.profileImage || "",
        email: currentUser.email,
      },
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts); // Updating the status
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  return (
    <div className={style.main_page}>
      {/* Your massage */}
      <PostForm onCreatePost={handleCreatePost} />

      {/* People messages  */}
      <div className={style.posts_wrapper}>
        <PostList posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
};
