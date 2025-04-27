import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((user) => user.email === email && user.password === password);

    if (foundUser) {
      foundUser.isLoggedIn = true;
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    const updatedUser = { ...currentUser, isLoggedIn: false };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(null);
    setTimeout(() => {
      navigate("/echat/register/me");
    }, 1000);
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = { ...userData, isLoggedIn: true };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  return { currentUser, login, logout, register };
};
