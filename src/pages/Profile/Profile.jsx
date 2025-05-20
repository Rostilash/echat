import style from "./Profile.module.css";
import { useState, useEffect } from "react";
import { Posts } from "./Tabs/Posts";
import { Media } from "./Tabs/Media";
import { Likes } from "./Tabs/Likes";
import { Bookmarks } from "./Tabs/Bookmarks";
import { ProfileHeader } from "./ProfileHeader/ProfileHeader";
import { EditProfileForm } from "./EditProfile/EditProfileForm";
import { Tabs } from "../../components/Tabs/Tabs";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { LoaderSmall } from "./../../components/Loader/LoaderSmall";
import { Reposts } from "./Tabs/Reposts";

export const Profile = () => {
  // URL params
  const { nickname: routeNickname } = useParams();
  const navigate = useNavigate();

  // load user & posts from localStorage
  const { currentUser, updateUser, ownerNickName, findUserByNickname } = useAuth();
  const { posts, setPosts } = useOutletContext();

  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!routeNickname || currentUser?.nickname === routeNickname) {
      setUser(currentUser); // if Own profile.
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find((u) => u.nickname === routeNickname);
      setUser(found || null);

      // if (!found) {
      //   setTimeout(() => {
      //     navigate("/echat/");
      //   }, 2000);
      // }
    }
  }, [routeNickname, currentUser]);

  if (!user) {
    return (
      <div className="loader_center">
        <LoaderSmall />
      </div>
    );
  }

  // Posts OutletContent
  const userPosts = (posts || []).filter((post) => post.author.email === user?.email);

  // If user email = current user = you are the owner
  const isOwner = currentUser?.email === user?.email;

  const tabComponents = {
    posts: Posts,
    media: Media,
    bookmarks: Bookmarks,
    likes: Likes,
    reposts: Reposts,
  };

  const ActiveTabComponent = tabComponents[tab];

  const tabsName = [
    {
      key: "posts",
      label: "Пости",
      icon: "https://cdn-icons-png.flaticon.com/128/2099/2099085.png",
    },
    {
      key: "media",
      label: "Медіа",
      icon: "https://cdn-icons-png.flaticon.com/128/3313/3313887.png",
    },
    {
      key: "bookmarks",
      label: "Збережені",
      icon: "https://cdn-icons-png.flaticon.com/128/4942/4942550.png",
    },
    {
      key: "likes",
      label: "Уподобання",
      icon: "https://cdn-icons-png.flaticon.com/128/833/833472.png",
    },
    {
      key: "reposts",
      label: "Репости",
      icon: "https://cdn-icons-png.flaticon.com/128/12604/12604036.png",
    },
  ];

  return (
    <div className={style.profileWrapper}>
      <ProfileHeader
        user={user}
        onEditClick={() => setIsEditing((prev) => !prev)}
        postsCount={userPosts.length}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isOwner={isOwner}
      />

      {isEditing && isOwner ? (
        <EditProfileForm setPosts={setPosts} />
      ) : (
        <>
          <Tabs current={tab} onChange={setTab} tabs={tabsName} isOwner={isOwner} />

          {ActiveTabComponent && (
            <ActiveTabComponent posts={posts} user={user} setPosts={setPosts} currentUser={currentUser} updateUser={updateUser} />
          )}
        </>
      )}
    </div>
  );
};
