'use client';

import { ChevronDown, Reply, Edit, Trash2, Copy, Forward, Pin, Info, Heart, ThumbsUp, Laugh, Angry, Frown } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Conversation, Message } from '@/data/messages/conversations';

interface MessageAreaProps {
  selectedConversation: Conversation | undefined;
  formatTime: (date: Date) => string;
  hoveredMessageId: string | null;
  setHoveredMessageId: (id: string | null) => void;
  showMessageMenu: string | null;
  setShowMessageMenu: (id: string | null) => void;
  pinnedMessages: string[];
  isSelectMode: boolean;
  selectedMessages: string[];
  handleSelectMessage: (id: string) => void;
  handleReplyMessage: (id: string) => void;
  handleForwardMessage: (id: string) => void;
  handlePinMessage: (id: string) => void;
  handleEditMessage: (id: string) => void;
  handleCopyMessage: (id: string, content: string) => void;
  handleMessageInfo: (id: string) => void;
  handleDeleteMessage: (id: string) => void;
  handleAddEmoji: (id: string, emoji: string) => void;
}

export default function MessageArea({
  selectedConversation,
  formatTime,
  setHoveredMessageId,
  showMessageMenu,
  setShowMessageMenu,
  pinnedMessages,
  isSelectMode,
  selectedMessages,
  handleSelectMessage,
  handleReplyMessage,
  handleForwardMessage,
  handlePinMessage,
  handleEditMessage,
  handleCopyMessage,
  handleMessageInfo,
  handleDeleteMessage,
  handleAddEmoji,
}: MessageAreaProps) {
  const { theme } = useTheme();

  // Mesajları tarihe göre gruplandırma fonksiyonu
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: { messages: Message[], sortOrder: number } } = {};
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      let sortOrder: number;
      
      // Bugün mü?
      if (messageDate.toDateString() === today.toDateString()) {
        dateKey = 'Bugün';
        sortOrder = 0;
      }
      // Dün mü?
      else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Dün';
        sortOrder = 1;
      }
      // Bu hafta içinde mi?
      else if (today.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        dateKey = days[messageDate.getDay()];
        sortOrder = 2 + (7 - (today.getTime() - messageDate.getTime()) / (24 * 60 * 60 * 1000));
      }
      // Daha eski tarihler
      else {
        dateKey = messageDate.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
        sortOrder = 10 + (today.getTime() - messageDate.getTime()) / (24 * 60 * 60 * 1000);
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = { messages: [], sortOrder };
      }
      groups[dateKey].messages.push(message);
    });
    
    // Grupları sıralama düzenine göre sırala
    const sortedGroups: { [key: string]: any[] } = {};
    Object.entries(groups)
      .sort(([, a], [, b]) => a.sortOrder - b.sortOrder)
      .forEach(([key, value]) => {
        // Her grup içindeki mesajları da zamana göre sırala (eskiden yeniye)
        sortedGroups[key] = value.messages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    
    return sortedGroups;
  };

  // Mesajları tarihe göre gruplandır
  const messageGroups = selectedConversation ? groupMessagesByDate(selectedConversation.messages) : {};

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {Object.entries(messageGroups).map(([dateKey, messages]) => (
        <div key={dateKey} className="space-y-4">
          {/* Tarih Başlığı */}
          <div className="flex justify-center my-6">
            <div className={`relative px-6 py-2 rounded-full text-sm font-semibold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 text-gray-200 border border-gray-600/30'
                : 'bg-gradient-to-r from-white/90 to-gray-50/90 text-gray-700 border border-gray-200/30'
            } backdrop-blur-md shadow-xl`}>
              <div className={`absolute inset-0 rounded-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10'
                  : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
              }`}></div>
              <span className="relative z-10">{dateKey}</span>
            </div>
          </div>
          
          {/* Bu tarihteki mesajlar */}
          {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${
            message.senderId === 'current_user' ? 'justify-end' : 'justify-start'
          }`}
          onMouseEnter={() => setHoveredMessageId(message.id)}
          onMouseLeave={() => setHoveredMessageId(null)}
          onClick={() => isSelectMode && handleSelectMessage(message.id)}
        >
          <div className="relative group">
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
              message.senderId === 'current_user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-100 text-gray-900'
            } ${pinnedMessages.includes(message.id) ? 'ring-2 ring-yellow-400' : ''} ${
              selectedMessages.includes(message.id) ? 'ring-2 ring-green-400' : ''
            } ${isSelectMode ? 'cursor-pointer' : ''}`}>
              {pinnedMessages.includes(message.id) && (
                <Pin className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 bg-white rounded-full p-0.5" />
              )}
              {isSelectMode && (
                <div className={`absolute -top-2 -left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMessages.includes(message.id)
                    ? 'bg-green-500 border-green-500'
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-500'
                      : 'bg-white border-gray-300'
                }`}>
                  {selectedMessages.includes(message.id) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs ${
                  message.senderId === 'current_user'
                    ? 'text-blue-100'
                    : theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
                
                {/* Aşağı Ok Butonu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMessageMenu(showMessageMenu === message.id ? null : message.id);
                  }}
                  className={`ml-2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity ${
                    message.senderId === 'current_user'
                      ? 'hover:bg-white/20'
                      : theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Dropdown Menü */}
            {showMessageMenu === message.id && (
              <div className={`absolute z-50 ${
                message.senderId === 'current_user' ? '-left-48' : '-right-48'
              } top-8 w-48 rounded-lg shadow-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="py-1">
                  {/* Emoji Tepkiler */}
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                    <p className={`text-xs font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      İfade Bırak
                    </p>
                    <div className="flex space-x-2">
                      {[
                        { emoji: '❤️', icon: Heart },
                        { emoji: '👍', icon: ThumbsUp },
                        { emoji: '😂', icon: Laugh },
                        { emoji: '😢', icon: Frown },
                        { emoji: '😡', icon: Angry }
                      ].map(({ emoji }) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddEmoji(message.id, emoji)}
                          className={`p-1 rounded hover:bg-opacity-50 ${
                            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleReplyMessage(message.id)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Cevapla</span>
                  </button>

                  <button
                    onClick={() => handleForwardMessage(message.id)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Forward className="w-4 h-4" />
                    <span>İlet</span>
                  </button>

                  <button
                    onClick={() => handlePinMessage(message.id)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                    <span>{pinnedMessages.includes(message.id) ? 'Sabitlemeyi Kaldır' : 'Sabittle'}</span>
                  </button>
                  
                  {message.senderId === 'current_user' && (
                    <button
                      onClick={() => handleEditMessage(message.id)}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Düzenle</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCopyMessage(message.id, message.content)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Kopyala</span>
                  </button>

                  <button
                    onClick={() => handleMessageInfo(message.id)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    <span>Mesaj Bilgisi</span>
                  </button>
                  
                  {message.senderId === 'current_user' && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 hover:bg-opacity-50 ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Sil</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
          ))}
        </div>
      ))}
    </div>
  );
}
