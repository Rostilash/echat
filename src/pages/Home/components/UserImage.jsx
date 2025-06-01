import style from "./PostHeader.module.css";
import { Link } from "react-router-dom";

export const UserImage = ({ author, online }) => {
  return (
    <div className={style.user_image}>
      {online && <span className={style.isOnline}></span>}

      <Link to={`/profile/${author?.uid}`}>
        <img
          src={(author?.id && (author?.profileImage || author.authorImg)) || "https://cdn-icons-png.flaticon.com/128/1837/1837625.png"}
          alt="user"
          onError={(e) => {
            e.currentTarget.src = "https://cdn-icons-png.flaticon.com/128/1837/1837625.png";
          }}
        />
      </Link>
    </div>
  );
};
