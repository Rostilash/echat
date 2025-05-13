import React from "react";
import styles from "./Tabs.module.css";

export const Tabs = ({ tabs = [], current, onChange, ...props }) => {
  return (
    <div className={styles.tabsWrapper}>
      {tabs.map((tab) => (
        <button key={tab.key} className={`${styles.tabItem} ${current === tab.key ? styles.active : ""}`} onClick={() => onChange(tab.key)}>
          {/* {tab.icon && (
            <span className={styles.icon}>
              <img src={tab.icon} alt="icon" />
            </span>
          )} */}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
