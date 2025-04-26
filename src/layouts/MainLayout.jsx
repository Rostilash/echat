import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main style={{ flex: "1" }}>
        <Outlet /> {/* Тут рендеряться всі сторінки */}
      </main>
      <Footer />
    </>
  );
};
