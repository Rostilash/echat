import style from "./Profile.module.css";
import { useState, useEffect } from "react";
import { Posts } from "./Tabs/Posts";
import { Media } from "./Tabs/Media";
import { Likes } from "./Tabs/Likes";
import { ProfileHeader } from "./ProfileHeader/ProfileHeader";
import { EditProfileForm } from "./EditProfile/EditProfileForm";
import { Tabs } from "../../components/Tabs/Tabs";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext, useParams } from "react-router-dom";
import { formatDateWithCapitalMonth } from "../../utils/dateUtils";
import { LoaderSmall } from "./../../components/Loader/LoaderSmall";

export const Profile = () => {
  // URL params
  const { nickname: routeNickname } = useParams();
  // load user from localStorage
  const { currentUser } = useAuth();
  const { posts } = useOutletContext();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  console.log(currentUser);

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
  } = user || {};

  // Change the first letter of the month to uppercase
  const formattedDate = formatDateWithCapitalMonth(createdAt);

  // Posts OutletContent
  const userPosts = (posts || []).filter((post) => post.author.email === email);

  // filter users if own profile we can see
  const isOwner = currentUser?.email === user?.email;

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
        website={website}
        followers={followers.length || "0"}
        following={following.length || "0"}
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
