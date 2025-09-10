"use client";

import { useState, useEffect } from "react";
import ProfileForm from "./components/ProfileForm";
import AppearanceSettings from "./components/AppearanceSettings";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance">("profile");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = getThemeFromCookies();
    setTheme(savedTheme);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex pt-[80px] px-6 transition-colors duration-300 ${isDark ? "bg-[#3f2937] text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r pr-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "profile"
                ? isDark
                  ? "bg-gray-800 text-white font-semibold"
                  : "bg-blue-100 text-blue-700 font-semibold"
                : isDark
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            👤 Profil
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "appearance"
                ? isDark
                  ? "bg-gray-800 text-white font-semibold"
                  : "bg-blue-100 text-blue-700 font-semibold"
                : isDark
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🎨 Görünüm
          </button>
        </nav>
      </aside>

      {/* İçerik */}
      <main className="flex-1 pl-6">
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "appearance" && <AppearanceSettings />}
      </main>
    </div>
  );
}
