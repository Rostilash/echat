import { Link } from "react-router-dom";
import style from "./Links.module.css";

export const ToMainPage = () => {
  return (
    <Link to="/" className={style.backLink}>
      &#8592; Повернутися
    </Link>
  );
};
