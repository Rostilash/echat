import { addRepost, removeRepost, hasUserReposted } from "../../services/repostsService";

export const handleRepostPost = async ({ postId, posts, currentUser, setPosts }) => {
  const userId = currentUser.uid;
  const alreadyReposted = await hasUserReposted(postId, userId);

  if (alreadyReposted) {
    await removeRepost(postId, userId);
  } else {
    await addRepost(postId, userId);
  }

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      const delta = alreadyReposted ? -1 : 1;
      return {
        ...post,
        reposts: (post.reposts || 0) + delta,
      };
    }
    return post;
  });

  setPosts(updatedPosts);
};
