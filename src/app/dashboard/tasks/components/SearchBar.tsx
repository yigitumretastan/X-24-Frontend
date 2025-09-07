// components/SearchBar.tsx
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function getThemeFromCookies(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const themeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return themeCookie === "dark" ? "dark" : "light";
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getThemeFromCookies());
  }, []);

  return (
    <div className="relative w-full max-w-sm text-black">
      <Search
        className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-300" : "text-gray-400"}`}
      />
      <input
        type="text"
        placeholder="Görev ara..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
          theme === "dark"
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />
    </div>
  );
}
