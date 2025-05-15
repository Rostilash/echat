import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export const UserLink = ({ nickname }) => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth(); // припускаю, що є setCurrentUser теж

  const handleClick = () => {
    if (!currentUser) return;

    // Перевіряємо, чи є nickname у чатах
    if (!currentUser.chatUsers.includes(nickname)) {
      // Створюємо новий об'єкт з оновленим chatUsers
      const updatedUser = {
        ...currentUser,
        chatUsers: [...currentUser.chatUsers, nickname],
      };

      // Зберігаємо в localStorage
      updateUser(updatedUser);
    }

    // Переходимо до сторінки повідомлень з цим nickname
    navigate(`/echat/message/${currentUser.nickname}`);
  };

  return (
    <div>
      <button onClick={handleClick} style={{ all: "unset", cursor: "pointer", color: "blue", textDecoration: "underline" }}>
        Написати повідомлення {nickname}
      </button>
    </div>
  );
};
