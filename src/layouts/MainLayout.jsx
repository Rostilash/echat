import React from "react";
import { Outlet } from "react-router-dom";
import style from "./MainLayout.module.css";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Rightbar } from "../components/Rightbar/Rightbar";
import { useAuth } from "./../hooks/useAuth";

export const MainLayout = () => {
  const { currentUser, login, logout, register } = useAuth();
  return (
    <div className={style.layout}>
      <Sidebar currentUser={currentUser} handleLogout={logout} />
      <main className={style.content}>
        <Outlet />
      </main>
      <Rightbar />
    </div>
  );
};
