import { Link } from "react-router-dom";
import style from "../styles/ChatSideBar.module.css";

export const UsersChatNav = ({ user }) => {
  const path = "/echat/message/" + user?.nickname;

  return (
    <Link to={path}>
      <div className={`${style.userItem} ${user.hasUnread ? style.unread : ""}`}>
        <img src={user.profileImage} alt={user.name} className={style.avatar} />
        <div className={style.userInfo}>
          <div className={style.userHeader}>
            {user.name}

            {user.isLoggedIn && <span className={style.onlineDot}></span>}
            {user.hasUnread && <span className={style.unreadDot}></span>}
          </div>

          <p className={style.lastMessage}>{user.lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};
