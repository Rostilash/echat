import React, { useRef, useEffect } from "react";
import style from "../styles/Logs.module.css";

export const Logs = ({ logs }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);
  return (
    <>
      {logs.length > 0 && (
        <span className={style.game_logs}>
          {logs}
          <span ref={bottomRef} />
        </span>
      )}
    </>
  );
};
