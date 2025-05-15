import style from "./RecomendedUsers.module.css";
import { Button } from "../Button/Button";
import { FollowButton } from "../Button/FollowButton";

export const RecomendedUsers = ({ user }) => {
  if (!user) return null;

  return (
    <div className={style.newsItem}>
      <div className={style.newsContent}>
        <div className={style.recommended_info}>
          <div className={style.recommended_users}>
            <img src={user.profileImage} alt={user.name} />
          </div>
          <div className={style.newsTitles}>
            <p className={style.newsName}>
              {user.name} <img src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" alt="verified" />
            </p>
            <p className={style.newsInfoText}>@{user.nickname}</p>
          </div>
        </div>
        <div className={style.newsOptions}>
          <FollowButton nickname={user.nickname} />
        </div>
      </div>
    </div>
  );
};
