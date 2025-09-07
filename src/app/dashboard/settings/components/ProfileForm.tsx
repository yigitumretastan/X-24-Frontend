"use client";

import { useState, useEffect } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const cookie = cookies.find((c) => c.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
}

export default function ProfileForm() {
  // State'ler...
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userJobTitle, setUserJobTitle] = useState("");

  const [role, setRole] = useState<number | null>(null);
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [timezone, setTimezone] = useState<number | null>(null);
  const [timeFormat, setTimeFormat] = useState<number | null>(null);
  const [dateFormat, setDateFormat] = useState<number | null>(null);
  const [language, setLanguage] = useState<number | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // workspaceId, userId ve token alma
  useEffect(() => {
    if (typeof window === "undefined") return;

    const workspaceRaw = localStorage.getItem("selectedWorkspace");
    const rawToken = getCookieValue("userToken");

    let workspaceIdTemp: string | null = null;
    let userIdTemp: string | null = null;

    if (workspaceRaw) {
      try {
        const parsed = JSON.parse(workspaceRaw);
        workspaceIdTemp = parsed.id;
      } catch (e) {
        // Hata yönetimi istersen ekleyebilirsin
      }
    }

    if (rawToken) {
      try {
        const payload = JSON.parse(atob(rawToken.split(".")[1]));
        userIdTemp = payload?.sub || null;
      } catch {
        // Hata yönetimi istersen ekleyebilirsin
      }
    } else {
      const userLocal = localStorage.getItem("userId");
      if (userLocal) userIdTemp = userLocal;
    }

    setToken(rawToken);
    setWorkspaceId(workspaceIdTemp);
    setUserId(userIdTemp);
  }, []);

  // Kullanıcı verisini çek
  useEffect(() => {
    const fetchUserData = async () => {
      if (!workspaceId || !userId || !token || token.trim() === "") {
        setInitializing(false);
        return;
      }

      try {
        const res = await fetch(
          `${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          const user = data.data;

          setUserName(user.userName || "");
          setUserEmail(user.userEmail || "");
          setUserJobTitle(user.userJobTitle || "");

          setRole(user.role ?? null);
          setJoinedAt(user.joinedAt ?? null);
          setIsActive(user.isActive ?? true);
          setTimezone(user.timezone ?? null);
          setTimeFormat(user.timeFormat ?? null);
          setDateFormat(user.dateFormat ?? null);
          setLanguage(user.language ?? null);
          setNotificationsEnabled(user.notificationsEnabled ?? true);
          setEmailNotifications(user.emailNotifications ?? true);
        } else {
          alert("Kullanıcı verisi alınamadı.");
        }
      } catch {
        alert("Sunucu hatası.");
      } finally {
        setInitializing(false);
      }
    };

    fetchUserData();
  }, [workspaceId, userId, token]);

  // Profil güncelleme
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!workspaceId || !userId || !token || token.trim() === "") {
      alert("workspaceId, userId veya token eksik.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/WorkspaceUser/${workspaceId}/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userName,
            userEmail,
            userJobTitle: userJobTitle || null,
            userProfilePhoto: null,
            timezone,
            timeFormat,
            dateFormat,
            language,
            notificationsEnabled,
            emailNotifications,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Profil başarıyla güncellendi!");
      } else {
        alert("Hata: " + (data.message || "Bilinmeyen hata"));
      }
    } catch {
      alert("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return <p className="text-gray-500">Yükleniyor...</p>;

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Form alanları */}
      <div>
        <label className="block text-sm">Ad Soyad</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Unvan</label>
        <input
          type="text"
          value={userJobTitle}
          onChange={(e) => setUserJobTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Zaman Dilimi (timezone)</label>
          <input
            type="number"
            value={timezone ?? ""}
            onChange={(e) => setTimezone(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Saat Formatı</label>
          <select
            value={timeFormat ?? ""}
            onChange={(e) => setTimeFormat(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value={1}>24 Saat</option>
            <option value={0}>12 Saat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Tarih Formatı</label>
          <select
            value={dateFormat ?? ""}
            onChange={(e) => setDateFormat(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value={0}>GG/AA/YYYY</option>
            <option value={1}>AA/GG/YYYY</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Dil</label>
          <input
            type="number"
            value={language ?? ""}
            onChange={(e) => setLanguage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
        <label>Bildirimler Açık</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={(e) => setEmailNotifications(e.target.checked)}
        />
        <label>Email Bildirimleri Açık</label>
      </div>

      <hr className="my-4" />

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Rol:</strong> {role}
        </p>
        <p>
          <strong>Katılma Tarihi:</strong>{" "}
          {joinedAt ? new Date(joinedAt).toLocaleString() : "Bilinmiyor"}
        </p>
        <p>
          <strong>Aktif:</strong> {isActive ? "Evet" : "Hayır"}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Güncelleniyor..." : "Güncelle"}
      </button>
    </form>
  );
}
