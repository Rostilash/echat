import { Link } from "react-router-dom";

export const UserLink = ({ currentUser, nickname }) => {
  console.log(nickname);
  return (
    <div>
      <Link to={`/echat/message/${currentUser?.nickname || nickname}`}> Написати повідомлення {currentUser?.name || nickname}</Link>
    </div>
  );
};
