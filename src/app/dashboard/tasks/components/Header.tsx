"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import CreateTaskModal from "./CreateTaskModal";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateTask: () => Promise<void>;
  workspaceId: string; // workspaceId özelliğini ekledik
  userId: string; // userId özelliğini ekledik
}

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function Header({
  searchTerm,
  onSearchChange,
  workspaceId,
  userId,
}: HeaderProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies()); // Kullanıcının temasını al
  }, []);

  // Tema değişikliğine göre body sınıfını ayarla
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <div
        className={`mt-[72px] ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } shadow-sm border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Görevler</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Bugün: {new Date().toLocaleDateString("tr-TR")}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
            <button
              onClick={() => setModalOpen(true)}
              className={`flex items-center h-10 px-4 space-x-2 ${
                theme === "dark"
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg transition`}
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görev</span>
            </button>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        workspaceId={workspaceId}
        userId={userId}
      />
    </>
  );
}
