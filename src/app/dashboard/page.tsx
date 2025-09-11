"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TimeTracker from "./components/TimeTracker";

interface Workspace {
  id: string;
  name: string;
  platform?: string;
}

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function DashboardPage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = getThemeFromCookies();
    setTheme(savedTheme);

    const stored = localStorage.getItem("selectedWorkspace");
    if (!stored) {
      router.push("/workspaces");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setWorkspace(parsed);
    } catch {
      localStorage.removeItem("selectedWorkspace");
      router.push("/workspaces");
    }
  }, [router]);

  if (!workspace) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center p-8 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-lg">Yönlendiriliyor...</p>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen p-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          X-24&apos;e Hoşgeldiniz, {workspace.name}
        </h1>
        <p className="mb-8">
          Seçili Workspace: <strong>{workspace.name}</strong>
          {workspace.platform && <> ({workspace.platform})</>}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div
            className={`p-6 rounded shadow hover:shadow-md transition cursor-pointer ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Görevler</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Task yönetimini görüntüle.
            </p>
          </div>
          <div
            className={`p-6 rounded shadow hover:shadow-md transition cursor-pointer ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Analizler</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Workspace analizlerini incele.
            </p>
          </div>
        </div>

        {/* 🔗 TimeTracker Bileşeni */}
        <TimeTracker/>
      </div>
    </main>
  );
}
