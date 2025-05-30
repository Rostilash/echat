import React from "react";
import { Navigate } from "react-router-dom";

// The PrivateRoute component checks if the user is authorized
export const PrivateRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If the user is not logged in, redirect to the PreLoad page
  if (!currentUser || !currentUser.isLoggedIn) {
    return <Navigate to="/pre-page" replace />;
  }

  // If the user is authorized, return the desired component
  return children;
};
