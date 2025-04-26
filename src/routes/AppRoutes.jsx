import { Route, Routes, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";

import { Home } from "../pages/Home/Home";
import { Register } from "../pages/Register/Register";
import { News } from "../pages/News/News";
import { TopPlaces } from "../pages/TopPlaces/TopPlaces";
import { Movies } from "../pages/Movies/Movies";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main page */}
      <Route path="/echat/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="news" element={<News />} />
        <Route path="top-places" element={<TopPlaces />} />
        <Route path="movies" element={<Movies />} />
      </Route>

      {/* Loading page without header and footer  */}
      <Route path="/echat/register/" element={<AuthLayout />}>
        <Route path="r/" element={<Register />} />
      </Route>

      {/* Redirect to main page */}
      <Route path="*" element={<Navigate to="/echat/" />} />
    </Routes>
  );
};
