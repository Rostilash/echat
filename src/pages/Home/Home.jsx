import style from "./Home.module.css";
import { PostForm } from "./PostForm/PostForm";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import { PostList } from "./components/PostList";
import { detectScheduledDate } from "./utils/detectScheduledDate";
import { useExtractTags } from "./utils/useExtractTags";
import { createPost, fetchPosts } from "../../services/postsService";
import { formatDate } from "../../utils/dateUtils";

export const Home = () => {
  const { currentUser } = useAuth();
  const { posts, setPosts, selectedFilter, loading } = useOutletContext();

  const today = new Date();
  const formattedToday = formatDate(today); // "YYYY-MM-DD"

  // Filter posts
  const getFilteredPosts = () => {
    switch (selectedFilter) {
      case "Сьогодні":
        return posts.filter((p) => formatDate(new Date(p.timestamp || p.scheduledFor)) === formattedToday);

      case "Завтра":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return posts.filter((p) => formatDate(new Date(p.scheduledFor || p.timestamp)) === formatDate(tomorrow));

      default:
        if (selectedFilter?.startsWith("#")) {
          return posts.filter((p) => Array.isArray(p.tags) && p.tags.map((tag) => tag.toLowerCase()).includes(selectedFilter.toLowerCase()));
        }
        return posts;
    }
  };

  // Function for creating a new post
  const handleCreatePost = async (text, mediaData) => {
    const scheduledDate = detectScheduledDate(text, today);

    const newPost = {
      authorId: currentUser.id || currentUser.uid,
      text,
      media: mediaData,
      timestamp: new Date().toISOString(),
      likes: 0,
      reposts: 0,
      region: currentUser.region || "Европа",
      comments: [],
      tags: useExtractTags(text) || [],
      scheduledFor: scheduledDate || formattedToday,
    };

    // Add post to Firestore
    const id = await createPost(newPost);

    const updatedPosts = await fetchPosts(); // update from server

    // Update local state
    setPosts(updatedPosts);
  };

  return (
    <div className={style.main_page}>
      {/* Сreate Post */}
      <PostForm onCreatePost={handleCreatePost} selectedFilter={selectedFilter} />

      {/* People messages */}
      <div className={style.posts_wrapper}>
        <PostList posts={getFilteredPosts()} setPosts={setPosts} loading={loading} />
      </div>
    </div>
  );
};
