import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
    }
    return false;
  };

  const logout = () => {
    const updatedUser = { ...currentUser, isLoggedIn: false };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(null);

    setInterval(() => {
      navigate("echat/register/me");
    }, 1000);
  };

  const generateUniqueNickname = (name) => {
    const base = name.toLowerCase().replace(/\s+/g, "_");
    const random = Math.floor(Math.random() * 1000);
    return `${base}_${random}`;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
      ...userData,
      isLoggedIn: true,
      profileImage: userData.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837645.png" || "",
      headerImage: "",
      createdAt: new Date().toISOString(), // account creation date
      region: "", // user's region (can be updated later)

      // profile details
      username: userData.name, // display name (full name)
      nickname: "@" + generateUniqueNickname(userData.name), // unique Twitter-style handle
      bio: "", // short user bio
      location: "", // city or country
      website: "", // personal website or link
      birthdate: "", // date of birth

      // social activity
      followers: [], // users who follow this user
      following: [], // users this user follows

      // interactions
      posts: [], // array of post IDs created by this user
      likes: [], // array of post IDs liked by this user
      bookmarks: [], // array of post IDs saved/bookmarked

      // settings
      emailVerified: false, // whether the email is verified
      theme: "light", // light or dark UI theme
      language: "uk", // UI language
      notifications: {
        mentions: true, // notify when mentioned
        follows: true, // notify when followed
        likes: true, // notify on likes
      },

      // timestamps
      lastLogin: null, // last login date
      updatedAt: null, // last profile update date
    };

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
