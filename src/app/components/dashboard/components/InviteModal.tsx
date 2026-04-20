"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (inviteData: {
    email: string;
    role: number;
    invitationMessage: string;
  }) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function InviteModal({ isOpen, onClose, onInvite, triggerRef }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(1);
  const [invitationMessage, setInvitationMessage] = useState("");
  const { theme } = useTheme();

  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (!isOpen) return;

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
  }, [isOpen, onClose, triggerRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite({ email, role, invitationMessage });
      setEmail("");
      setRole(1);
      setInvitationMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef} 
      className={`absolute top-[72px] right-[44px] w-96 min-w-96 backdrop-blur-xl rounded-2xl z-50 p-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-700/30 shadow-2xl text-white'
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300/40 shadow-xl text-black'
      }`}
    >
      <h2 className={`text-xl font-bold mb-6 text-center ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
        Üye Davet Et
      </h2>
      
      <div className="mb-5">
        <label className={`block text-sm font-semibold mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          E-posta Adresi
        </label>
        <input
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
          }`}
        />
      </div>

      <div className="mb-5">
        <label className={`block text-sm font-semibold mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Rol
        </label>
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value))}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none cursor-pointer appearance-none ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
          }`}
        >
          <option value={1}>Üye</option>
          <option value={2}>Moderatör</option>
          <option value={3}>Admin</option>
        </select>
      </div>

      <div className="mb-5">
        <label className={`block text-sm font-semibold mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Davet Mesajı (Opsiyonel)
        </label>
        <textarea
          placeholder="Kişiye özel bir mesaj yazabilirsiniz..."
          value={invitationMessage}
          onChange={(e) => setInvitationMessage(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none resize-none min-h-[100px] ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm'
          }`}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button 
          onClick={onClose} 
          className="btn-secondary px-6 py-3"
        >
          İptal
        </button>
        <button 
          onClick={handleSubmit} 
          className="btn-primary px-6 py-3"
        >
          Davet Gönder
        </button>
      </div>
    </div>
  );
}
