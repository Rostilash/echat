import { Link } from "react-router-dom";
import style from "./Links.module.css";

export const ToMainPage = () => {
  return (
    <Link to="/echat/" className={style.backLink}>
      ← Повернутися
    </Link>
  );
};
