import style from "./PostHeader.module.css";
import { Link } from "react-router-dom";

export const UserImage = ({ post, currentUser }) => {
  return (
    <div className={style.user_image}>
      <Link to={`/echat/profile/${post?.author.nickname}`}>
        <img
          src={
            post?.author.email === currentUser?.email
              ? currentUser?.profileImage ||
                "[https://cdn-icons-png.flaticon.com/128/1837/1837625.png](https://cdn-icons-png.flaticon.com/128/1837/1837625.png)"
              : post?.author.profileImage ||
                "[https://cdn-icons-png.flaticon.com/128/1837/1837625.png](https://cdn-icons-png.flaticon.com/128/1837/1837625.png)"
          }
          alt="user"
        />
      </Link>
    </div>
  );
};
