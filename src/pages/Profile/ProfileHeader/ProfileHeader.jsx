import s from "./ProfileHeader.module.css";
import { Button } from "../../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = ({ onEditClick, userName, postsCount, setIsEditing, isEditing, userImage, date, nickname, region, location }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (!isEditing) {
      navigate("/echat/");
    }
    setIsEditing(false);
  };
  return (
    <div className={s.profile_header}>
      <div className={s.head}>
        <span className={s.back_arrow} onClick={handleBack}>
          {/* <img src="" alt="arrow" /> */}
          &#8592;
        </span>
        <div className={s.head_user_info}>
          <span className={s.user_name}>{userName}</span>
          <span className={s.post_count}>Eчатнув: {postsCount} </span>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.background_image}>
          <img
            src="https://images.unsplash.com/photo-1746061641845-0825bf320bf1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxODl8fHxlbnwwfHx8fHw%3D"
            alt="user-image"
          />
        </div>
        <div className={s.user_body_info}>
          <div className={s.body_left}>
            <div className={s.head_user_info}>
              <img src={userImage} alt="user-image" style={{ marginBottom: "10px" }} />
              <span className={s.user_name}>{userName}</span>
              <span className={s.post_count}>{nickname} </span>
            </div>
          </div>
          <div className={s.body_right}>
            <Button onClick={onEditClick} variant="empty">
              Редагувати профіль
            </Button>
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <div className={s.user_from}>
          <span>{region || ""}</span>
          <span>{location || ""}</span>
          <span>Зареєстрований: {date}</span>
        </div>
        <div className={s.followers}>
          <span>Підписаний</span>
          <span>Підписалося </span>
        </div>
      </div>
    </div>
  );
};
