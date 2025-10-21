'use client';

import { useTheme } from '@/app/hooks/useTheme';
import { useMessages } from '@/app/hooks/useMessages';
import ConversationList from './ConversationList';
import MessageHeader from './MessageHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import MessageModals from './MessageModals';

export default function MessagesComponent() {
  const { theme } = useTheme();
  const messageHook = useMessages();

  return (
    <div className={`h-screen flex ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      
      {/* Sol Sidebar - Konuşma Listesi */}
      <ConversationList
        selectedUserId={messageHook.selectedUserId}
        setSelectedUserId={messageHook.setSelectedUserId}
        formatTime={messageHook.formatTime}
        isMobile={messageHook.isMobile}
      />

      {/* Ana Mesaj Alanı */}
      <div className="flex-1 flex flex-col">
        {messageHook.selectedUser ? (
          <>
            <MessageHeader
              selectedUser={messageHook.selectedUser}
              formatLastSeen={messageHook.formatLastSeen}
              isMobile={messageHook.isMobile}
              setSelectedUserId={messageHook.setSelectedUserId}
              isSelectMode={messageHook.isSelectMode}
              selectedMessages={messageHook.selectedMessages}
              setIsSelectMode={messageHook.setIsSelectMode}
              setSelectedMessages={messageHook.setSelectedMessages}
              showHeaderMenu={messageHook.showHeaderMenu}
              setShowHeaderMenu={messageHook.setShowHeaderMenu}
              setShowUserProfile={messageHook.setShowUserProfile}
              showMuteOptions={messageHook.showMuteOptions}
              setShowMuteOptions={messageHook.setShowMuteOptions}
              showBackgroundOptions={messageHook.showBackgroundOptions}
              setShowBackgroundOptions={messageHook.setShowBackgroundOptions}
              handleForwardSelected={messageHook.handleForwardSelected}
              handleDownloadSelected={messageHook.handleDownloadSelected}
              handleDeleteSelected={messageHook.handleDeleteSelected}
              handleMuteChat={messageHook.handleMuteChat}
              handleBlockUser={messageHook.handleBlockUser}
              handleClearChat={messageHook.handleClearChat}
              handleChangeBackground={messageHook.handleChangeBackground}
            />

            <MessageArea
              selectedConversation={messageHook.selectedConversation}
              formatTime={messageHook.formatTime}
              hoveredMessageId={messageHook.hoveredMessageId}
              setHoveredMessageId={messageHook.setHoveredMessageId}
              showMessageMenu={messageHook.showMessageMenu}
              setShowMessageMenu={messageHook.setShowMessageMenu}
              pinnedMessages={messageHook.pinnedMessages}
              isSelectMode={messageHook.isSelectMode}
              selectedMessages={messageHook.selectedMessages}
              handleSelectMessage={messageHook.handleSelectMessage}
              handleReplyMessage={messageHook.handleReplyMessage}
              handleForwardMessage={messageHook.handleForwardMessage}
              handlePinMessage={messageHook.handlePinMessage}
              handleEditMessage={messageHook.handleEditMessage}
              handleCopyMessage={messageHook.handleCopyMessage}
              handleMessageInfo={messageHook.handleMessageInfo}
              handleDeleteMessage={messageHook.handleDeleteMessage}
              handleAddEmoji={messageHook.handleAddEmoji}
            />

            <MessageInput
              newMessage={messageHook.newMessage}
              setNewMessage={messageHook.setNewMessage}
              handleSendMessage={messageHook.handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Bir konuşma seçin
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Mesajlaşmaya başlamak için sol taraftan bir kişi seçin
              </p>
            </div>
          </div>
        )}
      </div>

      <MessageModals
        showUserProfile={messageHook.showUserProfile}
        setShowUserProfile={messageHook.setShowUserProfile}
        showMessageInfo={messageHook.showMessageInfo}
        setShowMessageInfo={messageHook.setShowMessageInfo}
        selectedUser={messageHook.selectedUser}
        formatTime={messageHook.formatTime}
      />
    </div>
  );
}
