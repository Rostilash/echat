import { Link } from "react-router-dom";
import style from "../styles/ChatSideBar.module.css";

export const UsersChatNav = ({ user, messages }) => {
  const userId = user?.uid;
  const path = "/echat/message/" + userId;
  const hasUnread = messages.some((msg) => !msg.isRead && msg.to === userId);
  const lastMessage = messages.at(-1);
  const isMyMassage = lastMessage?.from.includes(userId);
  // console.log(unreadMessage);
  return (
    <Link to={path}>
      <div className={`${style.userItem} ${hasUnread ? style.unread : ""}`}>
        <img src={user.profileImage} alt={user.name} className={style.avatar} />
        <div className={style.userInfo}>
          <div className={style.userHeader}>
            {user.name}

            {user.isLoggedIn && <span className={style.onlineDot}></span>}
            {hasUnread && <span className={style.unreadDot}></span>}
          </div>

          <p className={style.lastMessage}>{isMyMassage ? `Вам: ${lastMessage?.content}` : `Ви: ${lastMessage?.content}`} </p>
        </div>
      </div>
    </Link>
  );
};
