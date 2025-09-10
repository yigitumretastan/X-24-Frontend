"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deleteCookie } from "@/app/utils/cookies";

interface ProfileModalProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function ProfileModal({ onClose, triggerRef }: ProfileModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Eğer modalın veya butonun dışına tıklanırsa kapat
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, triggerRef]);

  const handleProfileClick = () => {
    router.push("/dashboard/settings");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    deleteCookie("userToken");
    router.push("/auth/login");
  };

  return (
    <div
      ref={modalRef}
      className={`absolute top-[72px] right-15 w-48 rounded-[20px] shadow-lg z-50 ${
        theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      <div className="p-2 flex flex-col space-y-2">
        <button
          onClick={handleProfileClick}
          className={`w-full px-3 py-2 text-left rounded ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          Profil Detayları
        </button>
        <button
          onClick={handleLogout}
          className={`w-full px-3 py-2 text-left text-red-600 rounded ${
            theme === "dark" ? "hover:bg-red-900/20" : "hover:bg-red-100"
          }`}
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
