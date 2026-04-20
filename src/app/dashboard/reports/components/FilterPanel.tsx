"use client";

import { useTheme } from "@/app/contexts/ThemeContext";

export default function FilterPanel() {
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        🔍 Filtreler
      </h3>
      <div className="space-y-2">
        <button className={`w-full text-left p-3 rounded-xl border transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 text-gray-300'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
        }`}>
          📅 Bu Hafta
        </button>
        <button className={`w-full text-left p-3 rounded-xl border transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 text-gray-300'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
        }`}>
          📊 Okunmamış
        </button>
        <button className={`w-full text-left p-3 rounded-xl border transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 text-gray-300'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
        }`}>
          ⭐ Önemli
        </button>
      </div>
    </div>
  );
}
