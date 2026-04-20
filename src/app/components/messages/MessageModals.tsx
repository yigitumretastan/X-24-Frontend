'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { User } from '@/data/messages/users';
import { users } from '@/data/messages/users';

interface MessageModalsProps {
  showUserProfile: boolean;
  setShowUserProfile: (show: boolean) => void;
  showMessageInfo: string | null;
  setShowMessageInfo: (id: string | null) => void;
  selectedUser: User | undefined;
  formatTime: (date: Date) => string;
}

export default function MessageModals({
  showUserProfile,
  setShowUserProfile,
  showMessageInfo,
  setShowMessageInfo,
  selectedUser,
  formatTime,
}: MessageModalsProps) {
  const { theme } = useTheme();

  return (
    <>
      {/* Kullanıcı Profil Modal */}
      {showUserProfile && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-96 max-h-[80vh] overflow-y-auto rounded-lg shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Kişi Bilgisi
                </h3>
                <button
                  onClick={() => setShowUserProfile(false)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedUser.name}
                </h2>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedUser.role}
                </p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mt-2 ${
                  selectedUser.isOnline
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  {selectedUser.isOnline ? 'Aktif' : 'Çevrimdışı'}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    📞 İletişim Bilgileri
                  </h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Telefon:</strong> {selectedUser.phone}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <strong>Konum:</strong> {selectedUser.location}
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    ℹ️ Hakkında
                  </h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {selectedUser.bio}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                    📞 Ara
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all">
                    📹 Video Ara
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mesaj Bilgisi Modal */}
      {showMessageInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-96 max-h-[80vh] overflow-y-auto rounded-lg shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Mesaj Bilgisi
                </h3>
                <button
                  onClick={() => setShowMessageInfo(null)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    📊 Okunma Durumu
                  </h4>
                  <div className="space-y-2">
                    {users.slice(0, 3).map(user => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.name}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {Math.random() > 0.5 ? '✓✓ Okundu' : '✓ İletildi'} • {formatTime(new Date(Date.now() - Math.random() * 60 * 60 * 1000))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    📝 Mesaj Detayları
                  </h4>
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Gönderilme: {formatTime(new Date())}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tip: Metin mesajı
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Boyut: 45 karakter
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
