import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button/Button";
import { FollowButton } from "../../../components/Button/FollowButton";

export const UserLink = ({ nickname }) => {
  const navigate = useNavigate();

  const { currentUser, updateUser } = useAuth();

  const handleClickMessage = () => {
    if (!currentUser) return;

    // Checking if there is a nickname in chats
    if (!currentUser.chatUsers.includes(nickname)) {
      // Create a new object with the updated chatUsers
      const updatedUser = {
        ...currentUser,
        chatUsers: [...currentUser.chatUsers, nickname],
      };

      // Save UserInfo to localStorage
      updateUser(updatedUser);
    }

    // Redirecto to user with this nickname
    navigate(`/echat/message/${currentUser.nickname}`);
  };

  return (
    <div style={{ paddingTop: "50px", display: "flex", gap: "50px" }}>
      <Button onClick={handleClickMessage} variant="default">
        Написати повідомлення
      </Button>
      <FollowButton nickname={nickname} />
    </div>
  );
};
