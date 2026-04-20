"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/app/contexts/ThemeContext";
import { ArrowLeft } from "lucide-react";

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <main className={`min-h-screen p-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className={`backdrop-blur-sm rounded-3xl p-6 shadow-xl border ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700/50'
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  📋 Rapor Yönetimi
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Raporlarınızı oluşturun ve yönetin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </main>
  );
}
