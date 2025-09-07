"use client";

import { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import AppearanceSettings from "./components/AppearanceSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance">("profile");

  return (
    <div className="min-h-screen bg-white flex pt-[80px] px-6">
      {/* Sidebar */}
      <aside className="w-64 border-r pr-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "profile"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            👤 Profil
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "appearance"
                ? "bg-blue-100 text-blue-700 font-semibold"
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
