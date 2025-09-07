"use client";

import TimeTracker from "./components/TimeTracker";
import { useEffect, useState } from "react";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function RightPanel() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "73px",
        right: 0,
        width: "60px",
        height: `calc(100vh - 73px)`,
        backgroundColor: theme === "dark" ? "#1f2937" : "#f0f0f0", // dark: gray-800
        borderLeft: "1px solid #ccc",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10px",
        gap: "10px",
        transition: "width 0.3s ease",
      }}
    >
      <TimeTracker />
      <hr
        className={`w-8 ${theme === "dark" ? "border-gray-500" : "border-gray-400"}`}
      />
    </div>
  );
}
