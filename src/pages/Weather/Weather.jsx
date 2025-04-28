import React from "react";
import style from "./Weather.module.css";

export const Weather = () => {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe src="https://rostilash.github.io/weather-app/" width="100%" height="100%" title="Weather App" style={{ border: "none" }}></iframe>
    </div>
  );
};
