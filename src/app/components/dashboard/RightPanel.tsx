"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Bug, Send } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";

export default function RightPanel() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);

  return (
    <div className={`w-full h-full flex flex-col items-center py-4 px-2 transition-all duration-300 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-slate-900/50 border-l border-gray-700/30' 
        : 'bg-white/50 border-l border-gray-300/30'
    }`}>
      {/* Compact Icon Buttons */}
      <div className="flex flex-col gap-3 w-full">
        
        {/* Time Tracker Button */}
        <button
          onClick={() => setShowTimeModal(true)}
          className={`w-full aspect-square rounded-2xl p-3 transition-all duration-200 hover:scale-105 group relative ${
            theme === 'dark'
              ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50'
              : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
          }`}
          title="Zaman Takibi"
        >
          <Clock className={`w-8 h-8 mx-auto ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </button>

        {/* Message Users Avatars */}
        <div className="flex flex-col gap-2 w-full">
          {/* Ahmet Kaya */}
          <button
            onClick={() => {
              router.push('/messages?user=ahmet-kaya');
            }}
            className={`w-full aspect-square rounded-2xl p-2 transition-all duration-200 hover:scale-105 group relative ${
              theme === 'dark'
                ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50'
                : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
            }`}
            title="Ahmet Kaya"
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">AK</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </button>

          {/* Ayşe Kaya */}
          <button
            onClick={() => {
              router.push('/messages?user=ayse-kaya');
            }}
            className={`w-full aspect-square rounded-2xl p-2 transition-all duration-200 hover:scale-105 group relative ${
              theme === 'dark'
                ? 'bg-pink-900/30 hover:bg-pink-900/50 border border-pink-700/50'
                : 'bg-pink-50 hover:bg-pink-100 border border-pink-200'
            }`}
            title="Ayşe Kaya"
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">AY</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
          </button>

          {/* Mehmet Demir */}
          <button
            onClick={() => {
              router.push('/messages?user=mehmet-demir');
            }}
            className={`w-full aspect-square rounded-2xl p-2 transition-all duration-200 hover:scale-105 group relative ${
              theme === 'dark'
                ? 'bg-green-900/30 hover:bg-green-900/50 border border-green-700/50'
                : 'bg-green-50 hover:bg-green-100 border border-green-200'
            }`}
            title="Mehmet Demir"
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">MD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
          </button>
        </div>

      </div>

      {/* Bug Report Button - Separate */}
      <div className="mt-auto mb-3">
        <button
          onClick={() => setShowBugModal(true)}
          className={`w-full aspect-square rounded-2xl p-3 transition-all duration-200 hover:scale-105 group ${
            theme === 'dark'
              ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-700/50'
              : 'bg-red-50 hover:bg-red-100 border border-red-200'
          }`}
          title="Hata Bildir"
        >
          <Bug className={`w-8 h-8 mx-auto ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`} />
        </button>
      </div>

      {/* Version Info - Compact */}
      <div className={`mb-4 text-center ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <div className="text-xs font-medium">v2.1.4</div>
        <div className="text-xs">18/10</div>
      </div>

      {/* Time Completion Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl p-4 ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          } shadow-2xl`}>
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-green-900/50 text-green-400' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <Clock className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Zaman Takibi
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Çalışma seansı kaydedildi
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTimeModal(false)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    setShowTimeModal(false);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Rapor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-4 ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-red-900/50 text-red-400' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <Bug className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Hata Bildir
              </h3>
            </div>

            <form className="space-y-3">
              <div>
                <select className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  <option>UI/UX Sorunu</option>
                  <option>Performans</option>
                  <option>Veri Kaybı</option>
                  <option>Çökme</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Başlık"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Açıklama..."
                  className={`w-full px-3 py-2 rounded-lg border resize-none text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBugModal(false)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowBugModal(false);
                  }}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
