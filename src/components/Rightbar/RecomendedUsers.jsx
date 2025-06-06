import style from "./RecomendedUsers.module.css";
import { Button } from "../Button/Button";
import { FollowButton } from "../Button/FollowButton";
import { UserImage } from "./../../pages/Home/components/UserImage";

export const RecomendedUsers = ({ user }) => {
  if (!user) return null;

  return (
    <div className={style.newsItem}>
      <div className={style.newsContent}>
        <div className={style.recommended_info}>
          {/* <span>{!user.isLogedIn && <p>зайшов</p>}</span> */}
          <UserImage author={user} online={user.isLoggedIn} />
          <div className={style.newsTitles}>
            <p className={style.newsName}>
              {/* change "!" latter. (put for view page) */}
              {user.name} {!user.emailVerified && <img src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" alt="verified" />}
            </p>
            <p className={style.newsInfoText}>@{user.nickname}</p>
          </div>
        </div>
        <div className={style.newsOptions}>
          <FollowButton userId={user.uid} />
        </div>
      </div>
    </div>
  );
};
