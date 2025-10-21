'use client';

import { Phone, Video, MoreVertical, ArrowLeft, Forward, Download, Trash2, User, MessageSquare, BellOff, UserX, Eraser, Palette } from 'lucide-react';
import { useTheme } from '@/app/hooks/useTheme';
import { User as UserType } from '@/data/messages/users';

interface MessageHeaderProps {
  selectedUser: UserType;
  formatLastSeen: (date: Date) => string;
  isMobile: boolean;
  setSelectedUserId: (id: string | null) => void;
  isSelectMode: boolean;
  selectedMessages: string[];
  setIsSelectMode: (mode: boolean) => void;
  setSelectedMessages: (messages: string[]) => void;
  showHeaderMenu: boolean;
  setShowHeaderMenu: (show: boolean) => void;
  setShowUserProfile: (show: boolean) => void;
  showMuteOptions: boolean;
  setShowMuteOptions: (show: boolean) => void;
  showBackgroundOptions: boolean;
  setShowBackgroundOptions: (show: boolean) => void;
  handleForwardSelected: () => void;
  handleDownloadSelected: () => void;
  handleDeleteSelected: () => void;
  handleMuteChat: (duration: string) => void;
  handleBlockUser: () => void;
  handleClearChat: () => void;
  handleChangeBackground: (background: string) => void;
}

export default function MessageHeader({
  selectedUser,
  formatLastSeen,
  isMobile,
  setSelectedUserId,
  isSelectMode,
  selectedMessages,
  setIsSelectMode,
  setSelectedMessages,
  showHeaderMenu,
  setShowHeaderMenu,
  setShowUserProfile,
  showMuteOptions,
  setShowMuteOptions,
  showBackgroundOptions,
  setShowBackgroundOptions,
  handleForwardSelected,
  handleDownloadSelected,
  handleDeleteSelected,
  handleMuteChat,
  handleBlockUser,
  handleClearChat,
  handleChangeBackground,
}: MessageHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-4 border-b backdrop-blur-sm flex items-center justify-between ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700/50'
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button
            onClick={() => setSelectedUserId(null)}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="relative">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {selectedUser.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          )}
        </div>
        
        <div>
          <h2 className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedUser.name}
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {selectedUser.isOnline ? 'Aktif' : formatLastSeen(selectedUser.lastSeen)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isSelectMode ? (
          <>
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedMessages.length} seçili
            </span>
            <button
              onClick={handleForwardSelected}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Forward className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadSelected}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteSelected}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-red-400'
                  : 'hover:bg-gray-100 text-red-600'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsSelectMode(false);
                setSelectedMessages([]);
              }}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Phone className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Video className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Header Dropdown Menü */}
              {showHeaderMenu && (
                <div className={`absolute right-0 top-12 w-56 rounded-lg shadow-lg border z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserProfile(true);
                        setShowHeaderMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Kişi Bilgisi</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSelectMode(true);
                        setShowHeaderMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Mesaj Seç</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowMuteOptions(!showMuteOptions)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <BellOff className="w-4 h-4" />
                        <span>Bildirimleri Sessize Al</span>
                      </button>

                      {showMuteOptions && (
                        <div className={`absolute left-full top-0 ml-1 w-48 rounded-lg shadow-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className="py-1">
                            <button
                              onClick={() => handleMuteChat('1h')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              1 Saat
                            </button>
                            <button
                              onClick={() => handleMuteChat('8h')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              8 Saat
                            </button>
                            <button
                              onClick={() => handleMuteChat('1w')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              1 Hafta
                            </button>
                            <button
                              onClick={() => handleMuteChat('forever')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Her Zaman
                            </button>
                            <button
                              onClick={() => {
                                const customTime = prompt('Özel süre girin (dakika):');
                                if (customTime) handleMuteChat(`${customTime}m`);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Özel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleBlockUser}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <UserX className="w-4 h-4" />
                      <span>Engelle</span>
                    </button>

                    <button
                      onClick={handleClearChat}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <Eraser className="w-4 h-4" />
                      <span>Sohbeti Temizle</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                    <div className="relative">
                      <button
                        onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-opacity-50 ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        <span>Arka Plan Değiştir</span>
                      </button>

                      {showBackgroundOptions && (
                        <div className={`absolute left-full top-0 ml-1 w-48 rounded-lg shadow-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className="py-1">
                            <button
                              onClick={() => handleChangeBackground('default')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Varsayılan
                            </button>
                            <button
                              onClick={() => handleChangeBackground('gradient1')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Mavi Gradient
                            </button>
                            <button
                              onClick={() => handleChangeBackground('gradient2')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Mor Gradient
                            </button>
                            <button
                              onClick={() => handleChangeBackground('pattern1')}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-50 ${
                                theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Geometrik Desen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
