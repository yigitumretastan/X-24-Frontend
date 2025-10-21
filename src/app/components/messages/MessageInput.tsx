'use client';

import { Send, Paperclip, Smile } from 'lucide-react';
import { useTheme } from '@/app/hooks/useTheme';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

export default function MessageInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
}: MessageInputProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-4 border-t backdrop-blur-sm ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700/50'
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="flex items-center space-x-3">
        <button className={`p-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-600'
        }`}>
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mesajınızı yazın..."
            className={`w-full px-4 py-3 pr-12 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
          <button className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Smile className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={handleSendMessage}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
