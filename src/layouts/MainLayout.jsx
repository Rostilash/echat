import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import style from "./MainLayout.module.css";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Rightbar } from "../components/Rightbar/Rightbar";
import { useAuth } from "./../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  useTheme();

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
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  return (
    <div className={style.layout}>
      <Sidebar selectedPostFilter={setSelectedFilter} />
      <main className={style.content}>
        {/* Outlet  props */}
        <Outlet context={{ posts, setPosts, selectedFilter }} />
      </main>
      <Rightbar onSelectFilter={setSelectedFilter} posts={posts} />
    </div>
  );
};
