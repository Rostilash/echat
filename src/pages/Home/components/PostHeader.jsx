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
          <img src="https://cdn-icons-png.flaticon.com/128/7887/7887079.png" alt="icon" style={{ height: "12px", width: "12px" }} />
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
