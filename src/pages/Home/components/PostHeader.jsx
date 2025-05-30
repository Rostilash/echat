import { timeAgo } from "../../../utils/dateUtils";
import style from "./PostHeader.module.css";

export const PostHeader = ({ timeStamp, author }) => {
  if (!author) return;

  const createdAtComment = timeAgo(timeStamp);

  return (
    <div className={style.header_text}>
      <div className={style.user_name}>
        <p>
          {author?.name || author.authorName}{" "}
          {author.emailVerified && (
            <img src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" alt="icon" style={{ height: "16px", width: "16px" }} />
          )}
        </p>
        <span>@{author?.nickname || author.authorUsername}</span>
        <div className={style.dot_wrapper}>
          <span className={style.dot}>.</span>
        </div>
        <span>{createdAtComment}</span>
      </div>
    </div>
  );
};
