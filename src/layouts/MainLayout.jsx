import style from "./MainLayout.module.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Rightbar } from "../components/Rightbar/Rightbar";
import { fetchPosts } from "../services/postsService";
import { getLikesCount, hasUserLiked } from "../services/likesService";
import { getRepostsCount, hasUserReposted } from "../services/repostsService";
import { getBookmarksCount, hasUserBookmarked } from "../services/bookmarksService";
import { useAuth } from "../hooks/useAuth";

export const MainLayout = () => {
  const { currentUser } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsWithStats, setPostsWithStats] = useState([]);

  // Upload all posts
  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };
    loadPosts();
  }, []);

  //load stats(actions) on post later
  useEffect(() => {
    console.log("Effect for loading stats ran", posts);
    if (posts.length === 0 || !currentUser) {
      setPostsWithStats([]);
      return;
    }

    const loadStatsAndUserLikes = async () => {
      const newPostsWithStats = await Promise.all(
        posts.map(async (post) => {
          const [likes, reposts, bookmarks, userLiked, userReposted, userBookmarked] = await Promise.all([
            getLikesCount(post.id),
            getRepostsCount(post.id),
            getBookmarksCount(post.id),
            hasUserLiked(post.id, currentUser.id),
            hasUserReposted(post.id, currentUser.id),
            hasUserBookmarked(post.id, currentUser.id),
          ]);
          return { ...post, likes, reposts, bookmarks, userLiked, userReposted, userBookmarked };
        })
      );

      // Trying to awoid rerendering for testing on the moment.
      const isEqual =
        newPostsWithStats.length === postsWithStats.length &&
        newPostsWithStats.every((p, i) => {
          const oldP = postsWithStats[i];
          return (
            p.id === oldP.id &&
            p.likes === oldP.likes &&
            p.reposts === oldP.reposts &&
            p.bookmarks === oldP.bookmarks &&
            p.userLiked === oldP.userLiked &&
            p.userReposted === oldP.userReposted &&
            p.userBookmarked === oldP.userBookmarked
          );
        });

      if (!isEqual) {
        setPostsWithStats(newPostsWithStats);
      }
    };

    loadStatsAndUserLikes();
  }, [posts, currentUser]);

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

  // Now UI is working with postsWithStats (if he is not empty), or posts
  const displayPosts = postsWithStats.length > 0 ? postsWithStats : posts;

  return (
    <div className={style.layout}>
      <Sidebar selectedPostFilter={setSelectedFilter} />
      <main className={style.content}>
        <Outlet context={{ posts: displayPosts, setPosts, selectedFilter }} />
      </main>
      <Rightbar onSelectFilter={setSelectedFilter} posts={posts} users={users} />
    </div>
  );
};
