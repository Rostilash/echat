import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Home } from "../pages/Home/Home";
import { News } from "../pages/News/News";
import { TopPlaces } from "../pages/TopPlaces/TopPlaces";
import { ProtectedRoute } from "./../components/ProtectedRoute/ProtectedRoute";
import { PrivateRoute } from "./../components/ProtectedRoute/PrivateRoute";
import { AdminPanel } from "./../pages/AdminPanel/AdminPanel";
import { Profile } from "./../pages/Profile/Profile";
import { PrePage } from "./../pages/PrePage/PrePage";
import { Weather } from "./../pages/Weather/Weather";
import { MessagesWithProvider } from "../pages/Messages/components/MessagesWithProvider";
import { Movies } from "../pages/Movies/Movies";
import { Register } from "../components/Register/Register";
import { Login } from "../components/Login/Login";
import { CompressFiles } from "../pages/Compress/CompressFiles";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main page */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="news" element={<News />} />
        <Route path="top-places" element={<TopPlaces />} />
        <Route path="movies" element={<Movies />} />
        <Route path="profile/:uid" element={<Profile />} />
        <Route path="weather" element={<Weather />} />
      </Route>

      {/* for messages */}
      <Route path="message" element={<AuthLayout />}>
        <Route path=":uid" element={<MessagesWithProvider />} />
      </Route>

      {/* Loading page without header and footer  */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="pre-page" element={<PrePage />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="compress" element={<CompressFiles />} />
      </Route>

      {/* Admin panel  */}
      <Route
        path="admin-panel"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Redirect to main page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
