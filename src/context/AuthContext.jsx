import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

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
    }
    return false;
  };

  const logout = () => {
    const updatedUser = { ...currentUser, isLoggedIn: false };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(null);
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = { ...userData, isLoggedIn: true };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const updateUser = (newUserData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) => (user.email === newUserData.email ? { ...user, ...newUserData } : user));

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUserData));
    setCurrentUser(newUserData);
  };

  const changePassword = (email, oldPassword, newPassword) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) return { success: false, message: "Користувача не знайдено" };

    if (users[userIndex].password !== oldPassword) {
      return { success: false, message: "Старий пароль невірний" };
    }

    users[userIndex].password = newPassword;

    if (currentUser?.email === email) {
      const updatedUser = { ...currentUser, password: newPassword };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }

    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Пароль успішно змінено" };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateUser, setCurrentUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
