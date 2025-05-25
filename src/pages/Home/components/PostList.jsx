import { useState, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { PostItem } from "./PostItem";
import style from "../Home.module.css";
import { LoaderSmall } from "../../../components/Loader/LoaderSmall";

export const PostList = ({ posts, setPosts, loading }) => {
  const { currentUser } = useAuth();
  const [visibleCount, setVisibleCount] = useState(5);

  const containerRef = useRef(null);

  if (!currentUser && loading) {
    return (
      <div className="loader_center">
        <LoaderSmall />
      </div>
    );
  }
  const handleScroll = () => {
    const container = containerRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      setVisibleCount((prev) => Math.min(prev + 10, posts.length)); // add +5 post
    }
  };

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <>
      <div ref={containerRef} className={style.post_list_container} onScroll={handleScroll}>
        {visiblePosts.map((post) => (
          <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} loading={loading} />
        ))}
      </div>
    </>
  );
};
