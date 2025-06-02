import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.isLoggedIn) {
    return <Navigate to="/pre-page" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/admin-panel" replace />;
  }

  return children;
};
