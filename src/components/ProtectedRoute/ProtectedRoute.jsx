import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/echat/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/echat/" replace />;
  }

  return children;
};
