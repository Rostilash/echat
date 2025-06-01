export const getPostActionArray = ({ post, handlers, isOwner, isAuthorComment }) => {
  const actions = [
    {
      key: "likes",
      isActive: post.userLiked === true,
      handleClick: () => handlers.handleLike(post.id),
      activeImage: "https://cdn-icons-png.flaticon.com/128/210/210545.png",
      defaultImage: "https://cdn-icons-png.flaticon.com/128/1077/1077035.png",
      count: post.likes,
    },
    {
      key: "comments",
      isActive: isAuthorComment,
      handleClick: () => handlers.handleClickComment(post.id),
      activeImage: "https://cdn-icons-png.flaticon.com/128/2190/2190552.png",
      defaultImage: "https://cdn-icons-png.flaticon.com/128/16689/16689811.png",
      count: post.comments?.length ?? "",
    },
    {
      key: "reposts",
      isActive: post.userReposted === true,
      handleClick: () => handlers.handleRepost(post.id),
      activeImage: "https://cdn-icons-png.flaticon.com/128/11289/11289820.png",
      defaultImage: "https://cdn-icons-png.flaticon.com/128/14385/14385249.png",
      count: post.reposts,
    },
    {
      key: "bookmarks",
      isActive: post.userBookmarked === true,
      handleClick: () => handlers.handleBookmark(post.id),
      activeImage: "https://cdn-icons-png.flaticon.com/128/4942/4942550.png",
      defaultImage: "https://cdn-icons-png.flaticon.com/128/3983/3983871.png",
    },
  ];
  // hide for currentUser & need to update for upload post
  // if (!isOwner) {
  //   actions.push({
  //     key: "notOwnerIndicator",
  //     isActive: false,
  //     handleClick: null,
  //     activeImage: "https://cdn-icons-png.flaticon.com/128/18166/18166719.png",
  //     defaultImage: "https://cdn-icons-png.flaticon.com/128/18166/18166719.png",
  //   });
  // }

  return actions;
};
