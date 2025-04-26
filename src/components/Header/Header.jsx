import { Link } from "react-router-dom";
import style from "./Header.module.css";

export const Header = () => {
  return (
    <header className={style.navbar}>
      <div className={style.navbar__container}>
        <div className={style.navbar__logo}>
          <Link to="/">
            e<b>Chat</b>
          </Link>
        </div>
        <nav className={style.navbar__links}>
          <Link to="/echat/">Головна</Link>
          <Link to="/echat/news">Новини</Link>
          <Link to="/echat/top-places">Топ Закладів</Link>
          <Link to="/echat/movies">Фільми</Link>
          <Link to="/echat/register" className="navbar__register-btn">
            Реєстрація
          </Link>
        </nav>
      </div>
    </header>
  );
};
