"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { deleteCookie } from "@/app/utils/cookies";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/hooks/useTheme";

interface ProfileModalProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ProfileModal({ onClose, triggerRef }: ProfileModalProps) {
  const router = useRouter();
  const { } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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
    // Dashboard'dan logout yapıldığında workspaces sayfasına yönlendir
    localStorage.removeItem("userToken");
    deleteCookie("userToken");
    deleteCookie("userData");
    router.push("/workspaces");
  };

  return (
    <div 
      ref={modalRef} 
      className={`absolute top-[72px] right-[60px] w-56 backdrop-blur-xl rounded-2xl z-50 p-3 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700/30 shadow-2xl text-white'
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300/40 shadow-xl text-black'
      }`}
    >
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleProfileClick} 
          className={`w-full px-4 py-3.5 text-left border-none rounded-xl bg-transparent text-sm font-medium cursor-pointer transition-all duration-200 flex items-center gap-3 hover:transform hover:translate-x-1 ${
            theme === 'dark' 
              ? 'text-white hover:bg-slate-700/50' 
              : 'text-black hover:bg-gray-50/80'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ayarlar
        </button>
        <button 
          onClick={handleLogout} 
          className="w-full px-4 py-3.5 text-left border-none rounded-xl bg-transparent text-sm font-medium cursor-pointer transition-all duration-200 flex items-center gap-3 hover:transform hover:translate-x-1 hover:bg-red-500/10 hover:text-red-500"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
