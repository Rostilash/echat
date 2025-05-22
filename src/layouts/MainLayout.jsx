import style from "./MainLayout.module.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Rightbar } from "../components/Rightbar/Rightbar";
import { fetchPosts } from "../services/postsService";
// useTheme(); fix that avoid theme of user

export const MainLayout = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [posts, setPosts] = useState([]);

  // upload from fireBase
  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  // Synchronizing localStorage when changing posts
  useEffect(() => {
    const prevPosts = localStorage.getItem("posts");
    const currentPosts = JSON.stringify(posts);
    if (prevPosts !== currentPosts) {
      localStorage.setItem("posts", currentPosts);
    }
  }, [posts]);

  //Mark for update users letter from fireBase
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  return (
    <div className={style.layout}>
      <Sidebar selectedPostFilter={setSelectedFilter} />
      <main className={style.content}>
        <Outlet context={{ posts, setPosts, selectedFilter }} />
      </main>
      <Rightbar onSelectFilter={setSelectedFilter} posts={posts} users={users} />
    </div>
  );
};
