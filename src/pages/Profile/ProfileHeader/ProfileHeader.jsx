import s from "./ProfileHeader.module.css";
import { Button } from "../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { formatDateWithCapitalMonth } from "../../../utils/dateUtils";

export const ProfileHeader = ({ user, postsCount, onEditClick, isEditing, setIsEditing, isOwner }) => {
  const navigate = useNavigate();

  const { name, profileImage, headerImage, nickname, region, website, followers = [], following = [], createdAt } = user;

  // Change the first letter of the month to uppercase
  const date = formatDateWithCapitalMonth(createdAt);

  const { theme, toggleTheme } = useTheme();

  const handleBack = () => {
    if (!isEditing) {
      navigate("/echat/");
    }
    setIsEditing(false);
  };
  return (
    <div className={s.profile_header}>
      <div className={s.themeSwitcher}>
        <button onClick={toggleTheme} className={s.themeButton}>
          {theme === "light" ? "🌙 Ніч" : "☀️ День"}
        </button>
      </div>

      <div className={s.head}>
        <span className={s.back_arrow} onClick={handleBack}>
          &#8592;
        </span>
        <div className={s.head_user_info}>
          <span className={s.user_name}>{name}</span>
          <span className={s.post_count}>Eчатнув: {postsCount} </span>
        </div>
      </div>
      {!isEditing && (
        <>
          <div className={s.body}>
            <div className={s.background_image}>
              <img src={headerImage} alt="user-image" />
            </div>
            <div className={s.user_body_info}>
              <div className={s.body_left}>
                <div className={s.head_user_info}>
                  <img src={profileImage} alt="user-image" style={{ marginBottom: "10px" }} />
                  <span className={s.user_name}>{name}</span>
                  <span className={s.post_count}>@{nickname}</span>
                </div>
              </div>
              <div className={s.body_right}>
                {isOwner && (
                  <Button onClick={onEditClick} variant="empty">
                    Редагувати профіль
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className={s.footer}>
            <div className={s.user_from}>
              <span>{region || ""}</span>
              <span>
                <a href={website || ""}>{website || ""}</a>
              </span>
              <span>Зареєстрований: {date}</span>
            </div>
            <div className={s.followers}>
              <span>{following} Підписався</span>
              <span>{followers} Підписаних </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
