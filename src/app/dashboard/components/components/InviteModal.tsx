"use client";

import { useState, useEffect, useRef } from "react";

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

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function InviteModal({ isOpen, onClose, onInvite, triggerRef }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(1);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

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
      className={`absolute top-[72px] right-11 w-80 rounded-[20px] shadow-lg z-50 p-5 ${
        theme === "dark"
          ? "bg-gray-800 text-white border border-gray-600"
          : "bg-white text-black border border-gray-300"
      }`}
      style={{ minWidth: "320px" }}
    >
      <h2 className="text-lg font-semibold mb-4">Kullanıcı Davet Et</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-3 py-2 border rounded ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
        />
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value))}
          className={`w-full px-3 py-2 border rounded ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
        >
          <option value={1}>Üye</option>
          <option value={2}>Yönetici</option>
        </select>
        <textarea
          placeholder="Davet mesajı (isteğe bağlı)"
          value={invitationMessage}
          onChange={(e) => setInvitationMessage(e.target.value)}
          className={`w-full px-3 py-2 border rounded resize-none ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
          rows={3}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200"
            }`}
          >
            İptal
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
}
