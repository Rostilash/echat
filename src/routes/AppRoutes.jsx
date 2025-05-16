import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Home } from "../pages/Home/Home";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { News } from "../pages/News/News";
import { TopPlaces } from "../pages/TopPlaces/TopPlaces";
import { Movies } from "../pages/Movies/Movies";
import { ProtectedRoute } from "./../components/ProtectedRoute/ProtectedRoute";
import { PrivateRoute } from "./../components/ProtectedRoute/PrivateRoute";
import { AdminPanel } from "./../pages/AdminPanel/AdminPanel";
import { Profile } from "./../pages/Profile/Profile";
import { PrePage } from "./../pages/PrePage/PrePage";
import { Weather } from "./../pages/Weather/Weather";
import { Messages } from "../pages/Messages/components/Messages";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main page */}
      <Route
        path="/echat/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="news" element={<News />} />
        <Route path="top-places" element={<TopPlaces />} />
        <Route path="movies/:id" element={<Movies />} />
        <Route path="profile/:nickname" element={<Profile />} />
        <Route path="weather" element={<Weather />} />
      </Route>

      {/* for messages */}
      <Route path="/echat/message/" element={<AuthLayout />}>
        <Route path=":nickname" element={<Messages />} />
      </Route>

      {/* Loading page without header and footer  */}
      <Route path="/echat/register/" element={<AuthLayout />}>
        <Route path="me/" element={<PrePage />} />
        <Route path="r/" element={<Register />} />
        <Route path="l/" element={<Login />} />
      </Route>

      {/* Admin panel  */}
      <Route
        path="/echat/admin-panel"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      {/* Redirect to main page */}
      {/* <Route path="*" element={<Navigate to="/echat/" />} /> */}
    </Routes>
  );
};
