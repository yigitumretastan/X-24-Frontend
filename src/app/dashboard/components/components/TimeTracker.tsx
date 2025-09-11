"use client";

import { useState, useEffect, useRef } from "react";
import { getCookie } from "@/app/utils/cookies";

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

interface ModalProps {
  onClose: () => void;
  onSubmit: (subject: string, description: string) => void;
}

function FinishModal({ onClose, onSubmit }: ModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!subject.trim()) {
      alert("Konu zorunludur.");
      return;
    }
    onSubmit(subject, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-80 max-w-full`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Zamanlayıcıyı Bitir
        </h2>
        <input
          type="text"
          placeholder="Konu"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Bitir
          </button>
        </div>
      </div>
    </div>
  );
}

interface TimeTrackerData {
  id: string;
  startedAt: string;
  isPaused: boolean;
  endedAt: string | null;
}

function parseJwt(token: string | null): string | null {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);

    // Token içindeki userId alanı
    const userId =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload["sub"] ||
      null;

    return userId;
  } catch (e) {
    console.error("JWT çözümleme hatası:", e);
    return null;
  }
}

export default function TimeTracker() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tracker, setTracker] = useState<TimeTrackerData | null>(null);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("userToken");
    const userId = parseJwt(token);
    setUserIdFromToken(userId);
  }, []);

  const storedWorkspace =
    typeof window !== "undefined" ? localStorage.getItem("selectedWorkspace") : null;
  const workspaceId = storedWorkspace ? JSON.parse(storedWorkspace).id : null;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getCookie("userToken")}`,
  };

  const fetchActiveTracker = async () => {
    if (!userIdFromToken) return;
    console.log("🔄 Aktif zamanlayıcı getiriliyor...");

    const res = await fetch(`${API_BASE}/api/TimeTracker/user/${userIdFromToken}`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      console.error("Aktif zamanlayıcı getirme başarısız");
      return;
    }

    const data = await res.json();
    console.log("📦 Tüm zamanlayıcılar:", data);

    const active = data.find((t: any) => !t.endedAt);
    if (active) {
      console.log("✅ Aktif zamanlayıcı bulundu:", active);

      setTracker(active);
      const started = new Date(active.startedAt);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - started.getTime()) / 1000);
      console.log(`⏱️ Geçen süre: ${elapsed} saniye`);
      setSeconds(elapsed);
    } else {
      console.log("ℹ️ Aktif zamanlayıcı yok.");
      setTracker(null);
      setSeconds(0);
    }
  };

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  useEffect(() => {
    fetchActiveTracker();
  }, [userIdFromToken]);

  useEffect(() => {
    if (tracker && !tracker.isPaused) {
      console.log("▶️ Sayaç başlatılıyor...");
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        console.log("⏸️ Sayaç durduruluyor.");
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tracker]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTracker = async () => {
    if (!userIdFromToken || !workspaceId) {
      console.warn("❌ Zaman takibi başlatılamadı: userId veya workspaceId eksik.", {
        userIdFromToken,
        workspaceId,
      });
      return;
    }

    // Aktif takip var mı kontrol et
    const activeResponse = await fetch(`${API_BASE}/api/TimeTracker/user/${userIdFromToken}`, {
      method: "GET",
      headers,
    });

    if (!activeResponse.ok) {
      console.error("❌ Aktif zamanlayıcı kontrolü başarısız");
      return;
    }

    const activeData = await activeResponse.json();
    const activeTracker = activeData.find((t: any) => !t.endedAt);

    if (activeTracker) {
      console.log("ℹ️ Zaten aktif bir zaman takip mevcut:", activeTracker);
      setTracker(activeTracker);
      const started = new Date(activeTracker.startedAt);
      const now = new Date();
      setSeconds(Math.floor((now.getTime() - started.getTime()) / 1000));
      return; // Yeni zaman takip başlatma, mevcut var
    }

    // Aktif takip yoksa yeni başlat
    console.log("🚀 Zaman takibi başlatılıyor...");
    const res = await fetch(
      `${API_BASE}/api/TimeTracker/start?userId=${userIdFromToken}&workspaceId=${workspaceId}`,
      {
        method: "POST",
        headers,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Hatası (start):", errorText);
      return;
    }

    const data = await res.json();
    console.log("✅ Başlatılan zamanlayıcı:", data);
    setTracker(data);
    const started = new Date(data.startedAt);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - started.getTime()) / 1000);
    console.log(`⏱️ Geçen süre: ${elapsed} saniye`);
    setSeconds(elapsed);
  };

  const pauseTracker = async () => {
    if (!tracker || !userIdFromToken) {
      console.warn("pauseTracker: Eksik bilgi", { tracker, userIdFromToken });
      return;
    }
    console.log("⏸️ Zamanlayıcı duraklatılıyor...");
    await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/pause?userId=${userIdFromToken}`, {
      method: "POST",
      headers,
    });
    fetchActiveTracker();
  };

  const resumeTracker = async () => {
    if (!tracker || !userIdFromToken) {
      console.warn("resumeTracker: Eksik bilgi", { tracker, userIdFromToken });
      return;
    }
    console.log("▶️ Zamanlayıcı devam ettiriliyor...");
    await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/resume?userId=${userIdFromToken}`, {
      method: "POST",
      headers,
    });
    fetchActiveTracker();
  };

  const finishTracker = async (subject: string, description: string) => {
    if (!tracker || !userIdFromToken) {
      console.warn("finishTracker: Eksik bilgi", { tracker, userIdFromToken });
      return;
    }

    if (!subject.trim()) {
      alert("Konu zorunludur.");
      return;
    }

    console.log("⏹️ Zamanlayıcı bitiriliyor...", { subject, description });
    await fetch(`${API_BASE}/api/TimeTracker/${tracker.id}/finish?userId=${userIdFromToken}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ subject, description }),
    });
    setTracker(null);
    setSeconds(0);
    setShowFinishModal(false);
  };

  const handleFinishButtonClick = () => {
    setShowFinishModal(true);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 p-1 relative">
      {tracker ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div
            className={`rounded-lg p-3 shadow-sm border w-full min-h-[120px] flex items-center justify-center ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
          >
            <div className="text-xs font-bold text-blue-600 font-mono leading-tight transform -rotate-90 whitespace-nowrap">
              {formatTime(seconds)}
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            {!tracker.isPaused ? (
              <button
                onClick={pauseTracker}
                className="w-full h-10 rounded-md font-medium bg-yellow-500 text-white hover:bg-yellow-600 text-xs transition-colors flex items-center justify-center"
              >
                ⏸️
              </button>
            ) : (
              <button
                onClick={resumeTracker}
                className="w-full h-10 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 text-xs transition-colors flex items-center justify-center"
              >
                ▶️
              </button>
            )}
            <button
              onClick={handleFinishButtonClick}
              className="w-full h-10 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 text-xs transition-colors flex items-center justify-center"
            >
              ⏹️
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startTracker}
          className="w-full h-16 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center"
        >
          ▶️
        </button>
      )}

      {showFinishModal && (
        <FinishModal
          onClose={() => setShowFinishModal(false)}
          onSubmit={(subject, description) => finishTracker(subject, description)}
        />
      )}
    </div>
  );
}
