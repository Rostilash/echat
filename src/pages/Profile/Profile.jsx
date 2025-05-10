import style from "./Profile.module.css";
import { useState } from "react";
import { Posts } from "./Tabs/Posts";
import { Media } from "./Tabs/Media";
import { Likes } from "./Tabs/Likes";
import { ProfileHeader } from "./ProfileHeader/ProfileHeader";
import { EditProfileForm } from "./EditProfile/EditProfileForm";
import { Tabs } from "../../components/Tabs/Tabs";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import { formatDateWithCapitalMonth } from "../../utils/dateUtils";
import { LoaderSmall } from "./../../components/Loader/LoaderSmall";

export const Profile = () => {
  // load user from localStorage
  const { currentUser } = useAuth();
  const { posts } = useOutletContext();
  const [tab, setTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    return (
      <div className={style.loader}>
        <LoaderSmall />
      </div>
    );
  }
  console.log(currentUser);
  const {
    name,
    profileImage,
    headerImage,
    email,
    createdAt,
    lastLogin,
    nickname,
    likes,
    bio,
    birthdate,
    followers,
    following,
    location,
    region,
    website,
  } = currentUser || {};

  // Change the first letter of the month to uppercase
  const formattedDate = formatDateWithCapitalMonth(createdAt);

  // Posts OutletContent
  const userPosts = (posts || []).filter((post) => post.author.email === email);

  return (
    <div className={style.profileWrapper}>
      <ProfileHeader
        onEditClick={() => setIsEditing((prev) => !prev)}
        posts={posts}
        userName={name}
        postsCount={userPosts.length}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        userImage={profileImage}
        date={formattedDate}
        nickname={nickname}
        region={region}
        location={location}
      />

      {isEditing ? (
        <EditProfileForm onClose={() => setIsEditing(false)} />
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
                key: "likes",
                label: "Уподобання",
                icon: "https://cdn-icons-png.flaticon.com/128/833/833472.png",
              },
            ]}
          />

          {/* Tab content rendering */}
          {tab === "posts" &&
            (userPosts.length === 0 ? <p className={style.no_posts_message}>Ви ще не створили жодного поста...</p> : <Posts posts={userPosts} />)}
          {tab === "media" && <Media posts={posts} />}
          {tab === "likes" && <Likes posts={posts} />}
        </>
      )}
    </div>
  );
};
