import style from "./MainLayout.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Rightbar } from "../components/Rightbar/Rightbar";
import { fetchPosts } from "../services/postsService";
import { getLikesCount, hasUserLiked } from "../services/likesService";
import { getRepostsCount, hasUserReposted } from "../services/repostsService";
import { getBookmarksCount, hasUserBookmarked } from "../services/bookmarksService";
import { fetchCommentsByPostId } from "../services/commentsService";
import { LoaderSmall } from "./../components/Loader/LoaderSmall";

export const MainLayout = () => {
  const { currentUser, isUserInitialized } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsWithStats, setPostsWithStats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload all posts
  useEffect(() => {
    if (!isUserInitialized || !currentUser) return;

    const loadPosts = async () => {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    loadPosts();
  }, [isUserInitialized, currentUser]);

  //load stats(actions) on post later
  useEffect(() => {
    // console.log("Effect for loading stats ran", posts);
    if (posts.length === 0 || !currentUser) {
      setPostsWithStats([]);
      return;
    }

    const loadStatsAndUserLikes = async () => {
      const newPostsWithStats = await Promise.all(
        posts.map(async (post) => {
          const postId = post.id || post.postId;
          const [likes, reposts, bookmarks, userLiked, userReposted, userBookmarked, comments] = await Promise.all([
            getLikesCount(postId),
            getRepostsCount(postId),
            getBookmarksCount(postId),
            hasUserLiked(postId, currentUser?.id),
            hasUserReposted(postId, currentUser?.id),
            hasUserBookmarked(postId, currentUser?.id),
            fetchCommentsByPostId(postId),
          ]);

          return { ...post, likes, reposts, bookmarks, userLiked, userReposted, userBookmarked, comments };
        })
      );

      // Trying to awoid rerendering for testing on the moment.
      // Load normal newPostsWithStats uid code and after turnts to currentUser Id need need to fix it later for now i will create commentId
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
            p.userBookmarked === oldP.userBookmarked &&
            JSON.stringify(p.comments) === JSON.stringify(oldP.comments)
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
        {isUserInitialized && !loading ? (
          <Outlet context={{ posts: displayPosts, setPosts, selectedFilter, loading }} />
        ) : (
          <div className="loader_center">
            <LoaderSmall />
          </div>
        )}
      </main>
      <Rightbar onSelectFilter={setSelectedFilter} posts={posts} users={users} />
    </div>
  );
};
