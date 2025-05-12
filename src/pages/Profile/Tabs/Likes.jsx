import style from "../Profile.module.css";
import { PostHeader } from "../../Home/components/PostHeader";
import { UserImage } from "../../Home/components/UserImage";
import { useAuth } from "../../../hooks/useAuth";

export const Likes = ({ posts, user, currentUser, setPosts }) => {
  const { updatePost } = useAuth();
  const likedPosts = (posts || []).filter((post) => user?.likes?.includes(post.id));

  if (likedPosts.length === 0) {
    return <p className={style.no_posts_message}>У вас ще немає жодного лайку ...</p>;
  }

  const handleUnlike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        //Removing a like from a post
        const updatedLikedBy = post.likedBy.filter((email) => email !== currentUser.email);
        return { ...post, likes: post.likes - 1, likedBy: updatedLikedBy };
      }
      return post;
    });

    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    // Update users & currentUser
    const updatedLikes = currentUser.likes.filter((id) => id !== postId);
    const updatedCurrentUser = {
      ...currentUser,
      likes: updatedLikes,
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedCurrentUser);
  };

  return (
    <div>
      {likedPosts.map((post) => (
        <div key={post.id} className={style.head}>
          <UserImage post={post} currentUser={currentUser} />
          <PostHeader post={post} />
          <p> {post.text.slice(0, 15)}</p>
          <span className={style.icon_image}>
            <img
              src={
                post.likedBy && post.likedBy.includes(currentUser.email)
                  ? "https://cdn-icons-png.flaticon.com/128/210/210545.png"
                  : "https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
              }
              alt="icon"
              onClick={() => handleUnlike(post.id)}
            />
            {"  "}
            <span>{post.likes || 0}</span>
          </span>
        </div>
      ))}
    </div>
  );
};
