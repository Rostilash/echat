import style from "./PostActions.module.css";

export const Action = ({ handleClick, isActive, activeImage, defaultImage = "#", count, hidenUsers = "" }) => {
  return (
    <span className={style.icon_image} onClick={handleClick}>
      <img src={isActive ? activeImage : defaultImage} alt="icon" />
      <span>{count}</span>
      {/* If we need to add people who like the current comment */}
      <span style={{ display: "none" }}>{hidenUsers} </span>
    </span>
  );
};
