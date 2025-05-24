import style from "./PostHeader.module.css";
import { Link } from "react-router-dom";

export const UserImage = ({ author }) => {
  return (
    <div className={style.user_image}>
      <Link to={`/echat/profile/${author?.id}`}>
        <img
          src={
            (author?.id && (author?.profileImage || author.authorImg)) ||
            "[https://cdn-icons-png.flaticon.com/128/1837/1837625.png](https://cdn-icons-png.flaticon.com/128/1837/1837625.png)"
          }
          alt="user"
        />
      </Link>
    </div>
  );
};
