import { Link } from "react-router-dom";
import style from "../styles/ChatSideBar.module.css";

export const UsersChatNav = ({ user, chatMessage, currentUserId, UrlID }) => {
  const partnerId = user?.uid;
  // redirect path when click on LINK
  const path = "/message/" + partnerId;

  // filtering actions for actions in chat
  const hasUnread = chatMessage.some((msg) => !msg.isRead && msg.to === currentUserId && msg.from === partnerId);
  const currentChat = partnerId.includes(UrlID);
  const lastMessage = chatMessage.at(-1);
  const isMyMessage = lastMessage?.from === currentUserId;
  const online = user.isLoggedIn;

  return (
    <Link to={path}>
      <div className={`${style.userItem} ${currentChat ? style.unread : ""}`}>
        <img src={user.profileImage} alt={user.name} className={style.avatar} />
        <div className={style.userInfo}>
          <div className={style.userHeader}>
            {user.name}
            {online && <span className={style.onlineDot}></span>}
            {hasUnread && <span className={style.unreadDot}></span>}
          </div>
          <p className={style.lastMessage}>
            {lastMessage?.content ? (isMyMessage ? `Ви: ${lastMessage.content}` : `Вам: ${lastMessage.content}`) : "Відповіді поки не має"}
          </p>
        </div>
      </div>
    </Link>
  );
};
