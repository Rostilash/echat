import style from "../Profile.module.css";
import { PostItem } from "../../Home/components/PostItem";
import { BookmarkedMovies } from "../../Movies/BookmarkedMovies";

export const Bookmarks = ({ posts, setPosts, currentUser, updatePost }) => {
  const bookmarksPosts = (posts || []).filter((post) => post?.userBookmarked === true);

  // if (bookmarksPosts.length === 0) {
  //   return <p className={style.no_posts_message}>У вас ще немає жодного репосту...</p>;
  // }

  return (
    <div style={{ position: "relative" }}>
      <BookmarkedMovies />
      {bookmarksPosts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={currentUser} updatePost={updatePost} />
      ))}
    </div>
  );
};
