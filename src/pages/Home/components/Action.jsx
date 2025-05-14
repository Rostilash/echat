import style from "./PostActions.module.css";

export const Action = ({ handleClick, isActive, activeImage, defaultImage = "#", count }) => {
  return (
    <span className={style.icon_image} onClick={handleClick}>
      <img src={isActive ? activeImage : defaultImage} alt="icon" />
      <span>{count}</span>
    </span>
  );
};
