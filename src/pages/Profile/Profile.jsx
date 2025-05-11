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
import { useOutletContext, useParams } from "react-router-dom";
import { LoaderSmall } from "./../../components/Loader/LoaderSmall";

export const Profile = () => {
  // URL params
  const { nickname: routeNickname } = useParams();
  // load user from localStorage
  const { currentUser } = useAuth();
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
    }
  }, [routeNickname, currentUser]);

  if (!user) {
    return (
      <div className="loader_center">
        <LoaderSmall />
      </div>
    );
  }

  const { email } = user || {};

  // Posts OutletContent
  const userPosts = (posts || []).filter((post) => post.author.email === email);

  // If user email = current user = you are the owner
  const isOwner = currentUser?.email === user?.email;

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
        <EditProfileForm />
      ) : (
        <>
          <Tabs
            current={tab}
            onChange={setTab}
            tabs={[
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
                label: "Репости",
                icon: "https://cdn-icons-png.flaticon.com/128/3313/3313887.png",
              },
              {
                key: "likes",
                label: "Уподобання",
                icon: "https://cdn-icons-png.flaticon.com/128/833/833472.png",
              },
            ]}
          />

          {/* Tab content rendering */}
          {tab === "posts" && <Posts posts={posts} user={user} userPosts={userPosts} />}
          {tab === "media" && <Media posts={posts} user={user} />}
          {tab === "bookmarks" && <Bookmarks posts={posts} user={user} />}
          {tab === "likes" && <Likes posts={posts} user={user} setPosts={setPosts} />}
        </>
      )}
    </div>
  );
};
