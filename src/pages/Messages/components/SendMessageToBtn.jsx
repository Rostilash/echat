import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button/Button";
import { FollowButton } from "../../../components/Button/FollowButton";
import { createMutualChatConnection } from "../../../firebase/chatHelpers";

export const UserLink = ({ userId }) => {
  const navigate = useNavigate();

  const { currentUser, updateUser } = useAuth();

  const handleClickMessage = async () => {
    if (!currentUser || !userId) return;

    // Create chat with this Person by user ID
    const updatedUser = await createMutualChatConnection(currentUser, userId);

    // Redirect to user with this nickname
    if (updatedUser) {
      await updateUser(updatedUser);
      navigate(`/message/${userId}`);
    }
  };

  return (
    <div style={{ display: "flex", gap: "50px" }}>
      <Button onClick={handleClickMessage} variant="default">
        Написати повідомлення
      </Button>
      <FollowButton userId={userId} />
    </div>
  );
};
