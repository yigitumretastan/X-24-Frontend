"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { getCookie } from '@/app/utils/cookies';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  sentAt: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  workspaceId: string;
  // Frontend uyumluluğu için
  text?: string;
  sender?: "user" | "other";
  timestamp?: string;
}

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  currentWorkspaceId: string | null;
  messages: Message[];
  typingUsers: string[];
  connectToWorkspace: (workspaceId: string) => Promise<void>;
  sendMessage: (workspaceId: string, content: string, mediaUrl?: string, mediaType?: string) => Promise<void>;
  startTyping: (workspaceId: string) => Promise<void>;
  stopTyping: (workspaceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: ReactNode;
}

export function SignalRProvider({ children }: SignalRProviderProps) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createConnection = async (): Promise<signalR.HubConnection | null> => {
    const token = getCookie('userToken');
    if (!token) {
      console.warn('Token bulunamadı, SignalR bağlantısı kurulamıyor');
      return null;
    }

    const hubUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:7171/hubs/chat' 
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7171'}/hubs/chat`;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event handlers
    newConnection.on('ReceiveMessage', (message: Message) => {
      console.log('Mesaj alındı:', message);
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.sentAt).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
    });

    newConnection.on('PreviousMessages', (messageHistory: Message[]) => {
      console.log('Önceki mesajlar alındı:', messageHistory);
      const formattedMessages = messageHistory.map(msg => ({
        ...msg,
        timestamp: new Date(msg.sentAt).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setMessages(formattedMessages);
    });

    newConnection.on('UserStartedTyping', (typingUser: { userId: string, userName: string }) => {
      if (typingUser.userId !== user?.id) {
        setTypingUsers(prev => [...prev.filter(id => id !== typingUser.userId), typingUser.userId]);
      }
    });

    newConnection.on('UserStoppedTyping', (typingUser: { userId: string }) => {
      setTypingUsers(prev => prev.filter(id => id !== typingUser.userId));
    });

    newConnection.on('UserJoined', (joinedUser: { userId: string, userName: string }) => {
      console.log(`${joinedUser.userName} workspace'e katıldı`);
    });

    newConnection.on('UserLeft', (leftUser: { userId: string, userName: string }) => {
      console.log(`${leftUser.userName} workspace'den ayrıldı`);
    });

    newConnection.on('MessageError', (error: any) => {
      console.error('Mesaj hatası:', error);
      alert('Mesaj gönderilirken hata oluştu: ' + error.error);
    });

    newConnection.onclose((error) => {
      console.log('SignalR bağlantısı kapandı:', error);
      setIsConnected(false);
      // Auto-reconnect after 5 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        if (currentWorkspaceId) {
          connectToWorkspace(currentWorkspaceId);
        }
      }, 5000);
    });

    newConnection.onreconnecting((error) => {
      console.log('SignalR yeniden bağlanıyor:', error);
      setIsConnected(false);
    });

    newConnection.onreconnected((connectionId) => {
      console.log('SignalR yeniden bağlandı:', connectionId);
      setIsConnected(true);
      if (currentWorkspaceId) {
        newConnection.invoke('JoinConversation', currentWorkspaceId);
      }
    });

    return newConnection;
  };

  const connectToWorkspace = async (workspaceId: string): Promise<void> => {
    try {
      // Disconnect existing connection
      if (connection) {
        await connection.stop();
      }

      const newConnection = await createConnection();
      if (!newConnection) return;

      await newConnection.start();
      console.log('SignalR bağlantısı başarılı');
      
      setConnection(newConnection);
      setIsConnected(true);
      setCurrentWorkspaceId(workspaceId);
      
      // Join workspace
      await newConnection.invoke('JoinConversation', workspaceId);
      
      // Get previous messages
      await newConnection.invoke('GetPreviousMessages', workspaceId);
      
    } catch (error) {
      console.error('SignalR bağlantı hatası:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = async (workspaceId: string, content: string, mediaUrl?: string, mediaType?: string): Promise<void> => {
    if (!connection || !isConnected || !user?.id) {
      throw new Error('Bağlantı hatası. Lütfen sayfayı yenileyin.');
    }

    try {
      await connection.invoke(
        'SendMessage',
        workspaceId,
        user.id,
        '', // receiverId - workspace mesajlaşmasında boş
        content,
        mediaUrl,
        mediaType
      );
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      throw error;
    }
  };

  const startTyping = async (workspaceId: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('StartTyping', workspaceId);
      } catch (error) {
        console.error('Yazma durumu başlatma hatası:', error);
      }
    }
  };

  const stopTyping = async (workspaceId: string): Promise<void> => {
    if (connection && isConnected) {
      try {
        await connection.invoke('StopTyping', workspaceId);
      } catch (error) {
        console.error('Yazma durumu durdurma hatası:', error);
      }
    }
  };

  const disconnect = useCallback(async (): Promise<void> => {
    if (connection) {
      if (currentWorkspaceId) {
        await connection.invoke('LeaveConversation', currentWorkspaceId).catch(console.error);
      }
      await connection.stop();
      setConnection(null);
      setIsConnected(false);
      setCurrentWorkspaceId(null);
      setMessages([]);
      setTypingUsers([]);
    }
  }, [connection, currentWorkspaceId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  const contextValue: SignalRContextType = {
    connection,
    isConnected,
    currentWorkspaceId,
    messages,
    typingUsers,
    connectToWorkspace,
    sendMessage,
    startTyping,
    stopTyping,
    disconnect,
  };

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR(): SignalRContextType {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
}
