import React from "react";
import { ImageUpload } from "../../ImageUpload";
import style from "./LoadingImages.module.css";

export const LoadingImages = ({ currentUser, profileImage, updateUser, headerImage, uid }) => {
  return (
    <div className={style.userImages}>
      <div className={style.userProfileImage}>
        {/* load profile image */}
        <ImageUpload
          uploadKey="profileImage"
          maxSizeKB={50}
          currentUser={currentUser}
          image={profileImage}
          updateUser={updateUser}
          userUid={uid}
          iconPath="https://cdn-icons-png.flaticon.com/128/13407/13407013.png"
        />
      </div>
      {/* load header image */}
      <div className={style.userHeaderImage}>
        <ImageUpload
          uploadKey="headerImage"
          maxSizeKB={100}
          currentUser={currentUser}
          image={headerImage}
          updateUser={updateUser}
          userUid={uid}
          iconPath="https://cdn-icons-png.flaticon.com/128/13407/13407013.png"
        />
      </div>
    </div>
  );
};
