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

export const Profile = () => {
  const { currentUser } = useAuth(); // useContext

  const userName = currentUser?.name;
  const userImage = currentUser?.profileImage;
  const userEmail = currentUser?.email;

  const { posts, setPosts, selectedFilter } = useOutletContext(); // posts OutletContent

  const userPosts = (posts || []).filter((post) => post.author.email === userEmail);

  console.log(userPosts);
  const [tab, setTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={style.profileWrapper}>
      <ProfileHeader
        onEditClick={() => setIsEditing((prev) => !prev)}
        posts={posts}
        userName={userName}
        postsCount={userPosts.length}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        userImage={userImage}
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
          {tab === "posts" && <Posts posts={posts} />}
          {tab === "media" && <Media posts={posts} />}
          {tab === "likes" && <Likes posts={posts} />}
        </>
      )}
    </div>
  );
};
