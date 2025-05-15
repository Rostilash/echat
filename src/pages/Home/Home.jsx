import style from "./Home.module.css";
import { PostForm } from "./PostForm/PostForm";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import { PostList } from "./components/PostList";

const monthNames = {
  січня: 0,
  лютого: 1,
  березня: 2,
  квітня: 3,
  травня: 4,
  червня: 5,
  липня: 6,
  серпня: 7,
  вересня: 8,
  жовтня: 9,
  листопада: 10,
  грудня: 11,
};

const formatDate = (date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"

export const Home = () => {
  const { currentUser, updateUserProfile } = useAuth();
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

  // matches tags to localStorage
  function extractTags(text) {
    if (!text) return [];
    const matches = text.match(/#[\p{L}\p{N}_-]+/gu);
    return matches ? matches.map((tag) => tag.toLowerCase()) : [];
  }

  // add filter with date like tomorrow or 10 march (will add post on that date)
  function detectScheduledDate(text) {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const lowercaseText = text.toLowerCase();

    if (lowercaseText.includes("завтра")) {
      return formatDate(tomorrow);
    }

    if (lowercaseText.includes("сьогодні")) {
      return formattedToday;
    }

    const datePattern = /(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)/iu;
    const match = lowercaseText.match(datePattern);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = monthNames[match[2]];
      const targetDate = new Date(today.getFullYear(), month, day, 12); // avoiding UTC offset

      if (formatDate(targetDate) < formattedToday) {
        targetDate.setFullYear(today.getFullYear() + 1);
      }

      return formatDate(targetDate);
    }

    return null;
  }

  // Function for creating a new post
  const handleCreatePost = (text, mediaData) => {
    const scheduledDate = detectScheduledDate(text);

    const newPost = {
      id: Date.now().toString(),
      text,
      media: mediaData,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      region: currentUser.region || "",
      comments: [],
      tags: extractTags(text) || [],
      scheduledFor: scheduledDate || formattedToday,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        nickname: currentUser.nickname || currentUser.id,
        profileImage: currentUser.profileImage || "",
        email: currentUser.email,
      },
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Оновлення користувача через твою функцію
    const updatedCurrentUser = {
      ...currentUser,
      posts: [...(currentUser.posts || []), newPost.id],
      updatedAt: new Date().toISOString(),
    };
    updateUserProfile(updatedCurrentUser);
  };

  return (
    <div className={style.main_page}>
      {/* Your message */}
      <PostForm onCreatePost={handleCreatePost} />

      {/* People messages */}
      <div className={style.posts_wrapper}>
        <PostList posts={getFilteredPosts()} setPosts={setPosts} />
      </div>
    </div>
  );
};
