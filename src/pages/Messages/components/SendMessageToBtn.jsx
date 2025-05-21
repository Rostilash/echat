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

    // Створюємо зв’язок між користувачами
    const updatedUser = await createMutualChatConnection(currentUser, userId);

    // Redirect to user with this nickname
    if (updatedUser) {
      await updateUser(updatedUser); // оновити контекст, якщо треба
      navigate(`/echat/message/${userId}`);
    }
  };

  return (
    <div style={{ paddingTop: "50px", display: "flex", gap: "50px" }}>
      <Button onClick={handleClickMessage} variant="default">
        Написати повідомлення
      </Button>
      <FollowButton userId={userId} />
    </div>
  );
};
