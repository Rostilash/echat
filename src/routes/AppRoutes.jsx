import { Route, Routes, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";

import { Home } from "../pages/Home/Home";
import { Register } from "../pages/Register/Register";
import { News } from "../pages/News/News";
import { TopPlaces } from "../pages/TopPlaces/TopPlaces";
import { Movies } from "../pages/Movies/Movies";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main page */}
      <Route path="/echat/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/echat/news" element={<News />} />
        <Route path="/echat/top-places" element={<TopPlaces />} />
        <Route path="/echat/movies" element={<Movies />} />
      </Route>

      {/* Loading page without header and footer  */}
      <Route path="/echat/" element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
      </Route>

      {/* Redirect to main page */}
      <Route path="*" element={<Navigate to="/echat/" />} />
    </Routes>
  );
};

export default AppRoutes;
