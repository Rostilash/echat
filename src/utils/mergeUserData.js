export const mergeUserData = (oldUser, newData) => {
  return {
    ...oldUser,
    ...newData,

    password: oldUser.password,
    email: oldUser.email,
    createdAt: oldUser.createdAt,
    posts: oldUser.posts || [],
    likes: newData.likes || oldUser.likes || [],
    bookmarks: oldUser.bookmarks || [],
    followers: oldUser.followers || [],
    following: oldUser.following || [],
    nickname: newData.nickname || oldUser.nickname,
  };
};
