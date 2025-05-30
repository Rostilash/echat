import React from "react";
import style from "./Weather.module.css";
import { useNavigate } from "react-router-dom"; // якщо ти використовуєш React Router

export const Weather = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          padding: "10px 15px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Назад
      </button>
      <iframe src="https://rostilash.github.io/weather-app/" width="100%" height="100%" title="Weather App" style={{ border: "none" }}></iframe>
    </div>
  );
};
