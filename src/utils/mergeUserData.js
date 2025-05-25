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

    // Поля, які можуть бути змінені, але не повинні бути "" або falsy
    nickname: newData.nickname?.trim() || oldUser.nickname,
    profileImage: newData.profileImage?.trim() || oldUser.profileImage,
    headerImage: newData.headerImage?.trim() || oldUser.headerImage,
  };
};
