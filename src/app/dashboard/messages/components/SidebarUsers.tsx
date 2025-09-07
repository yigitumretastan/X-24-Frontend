"use client";
import { useEffect, useState } from "react";
import SearchBar from "./Search";
import axios from "axios";

interface User {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface SidebarUsersProps {
  onUserSelect: (userName: string) => void;
  selectedUser: string | null;
}

export default function SidebarUsers({
  onUserSelect,
  selectedUser,
}: SidebarUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => console.error("Kullanıcılar alınamadı:", err));
  }, []);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (name: string) => {
    // Bu renkler koyu temada biraz daha canlı ve kontrastlı olabilir
    const colors = [
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-purple-400",
      "bg-indigo-400",
      "bg-pink-400",
      "bg-teal-400",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <aside
      className="h-full flex flex-col bg-gray-900"
      style={{ paddingTop: "73px" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">Mesajlar</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Notlarım */}
      <div
        onClick={() => onUserSelect("notlarim")}
        className={`p-4 cursor-pointer transition-colors hover:bg-gray-800 ${
          selectedUser === "notlarim"
            ? "bg-blue-700 border-r-2 border-blue-500"
            : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">N</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-100 truncate">
                Notlarım
              </p>
              <p className="text-xs text-gray-400">Şimdi</p>
            </div>
            <p className="text-sm text-gray-400 truncate">
              Kendi notlarını buraya yaz...
            </p>
          </div>
        </div>
      </div>

      {/* Kullanıcılar */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-700">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user.name)}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-800 ${
                selectedUser === user.name
                  ? "bg-blue-700 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 ${getRandomColor(
                      user.name
                    )} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-sm font-medium text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.timestamp}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate">
                      {user.lastMessage}
                    </p>
                    {user.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Yeni Sohbet
        </button>
      </div>
    </aside>
  );
}
