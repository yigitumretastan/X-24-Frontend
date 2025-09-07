"use client";

import Link from "next/link";
import {
  Home,
  MessageSquareText,
  CheckSquare,
  FolderKanban,
  Calendar,
  BarChart2,
  HardDrive,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function Sidebar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  return (
    <aside
      style={{
        position: "fixed",
        top: "73px",
        left: 0,
        width: "128px",
        height: "calc(100vh - 73px)",
        backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6", // dark: bg-gray-800
        borderRight: "1px solid #d1d5db",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 10,
      }}
    >
      {/* Üst Menü */}
      <div className={`flex flex-col gap-4 text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
        <SidebarLink href="/dashboard" icon={<Home size={18} />} label="Anasayfa" />
        <SidebarLink href="/dashboard/messages" icon={<MessageSquareText size={18} />} label="Mesajlar" />
        <SidebarLink href="/dashboard/tasks" icon={<CheckSquare size={18} />} label="Görevler" />
        <SidebarLink href="/dashboard/projects" icon={<FolderKanban size={18} />} label="Projeler" />
        <SidebarLink href="/dashboard/calender" icon={<Calendar size={18} />} label="Takvim" />
        <SidebarLink href="/dashboard/analysis" icon={<BarChart2 size={18} />} label="Analiz" />
        <SidebarLink href="/dashboard/disk" icon={<HardDrive size={18} />} label="Disk" />
      </div>

      {/* Alt Menü */}
      <div className="mt-auto pt-4">
        <SidebarLink href="/dashboard/settings" icon={<Settings size={20} />} label="" center />
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  center = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  center?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`hover:text-indigo-600 flex items-center gap-2 ${
        center ? "justify-center" : ""
      }`}
    >
      {icon}
      {label && <span>{label}</span>}
    </Link>
  );
}
