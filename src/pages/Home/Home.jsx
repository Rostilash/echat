import style from "./Home.module.css";
import { PostForm } from "./PostForm/PostForm";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import { PostList } from "./components/PostList";
import { detectScheduledDate } from "./utils/detectScheduledDate";
import { useExtractTags } from "./utils/useExtractTags";
import { createPost } from "../../services/postsService";

// const monthNames = {
//   січня: 0,
//   лютого: 1,
//   березня: 2,
//   квітня: 3,
//   травня: 4,
//   червня: 5,
//   липня: 6,
//   серпня: 7,
//   вересня: 8,
//   жовтня: 9,
//   листопада: 10,
//   грудня: 11,
// };

const formatDate = (date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"

export const Home = () => {
  const { currentUser } = useAuth();
  const { posts, setPosts, selectedFilter } = useOutletContext();

  const today = new Date();
  const formattedToday = formatDate(today);

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
      id: Date.now().toString(),
      authorId: currentUser.id || currentUser.uid,
      text,
      media: mediaData,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      region: currentUser.region || "Европа",
      comments: [],
      tags: useExtractTags(text) || [],
      scheduledFor: scheduledDate || formattedToday,
    };

    // Add post to Firestore
    const id = await createPost(newPost);

    // Update local state з id та timestamp
    setPosts((prev) => [{ ...newPost, id, timestamp: new Date().toISOString() }, ...prev]);
  };

  return (
    <div className={style.main_page}>
      {/* Сreate Post */}
      <PostForm onCreatePost={handleCreatePost} />

      {/* People messages */}
      <div className={style.posts_wrapper}>
        <PostList posts={getFilteredPosts()} setPosts={setPosts} />
      </div>
    </div>
  );
};
