import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const savedTheme = currentUser?.theme || "light";

    setTheme(savedTheme);

    // Set the data-theme attribute on the element <html>
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    // Switch the theme between light and dark
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update for currentUser in localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    currentUser.theme = newTheme;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update in array - users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) => (user.email === currentUser.email ? { ...user, theme: newTheme } : user));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update the data-theme attribute on the element <html>
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, toggleTheme };
};
