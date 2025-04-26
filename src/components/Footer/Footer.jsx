import style from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
        <p>
          © {new Date().getFullYear()} Ros<b>Dev</b>. Всі права захищено.
        </p>
      </div>
    </footer>
  );
};
