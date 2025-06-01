import { PostItem } from "../../Home/components/PostItem";
import { BookmarkedMovies } from "../../Movies/BookmarkedMovies";

export const Bookmarks = ({ posts, setPosts, user, currentUser, updatePost }) => {
  const isOwner = user.uid === currentUser.uid;
  // for while we ignore people who is not the owner
  if (!isOwner) return;

  const bookmarksPosts = (posts || []).filter((post) => isOwner && post?.userBookmarked === true);

  return (
    <div style={{ position: "relative" }}>
      <BookmarkedMovies user={user} />
      {bookmarksPosts.map((post) => (
        <PostItem key={post.id} post={post} posts={posts} setPosts={setPosts} currentUser={user} updatePost={updatePost} />
      ))}
    </div>
  );
};
