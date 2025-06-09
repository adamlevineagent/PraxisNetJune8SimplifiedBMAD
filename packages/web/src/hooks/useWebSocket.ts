import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { websocketService, WebSocketEvents } from '@/services/websocket.service';
import type { Socket } from 'socket.io-client';

export function useWebSocket() {
  const { token } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      websocketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Connect to WebSocket
    const socket = websocketService.connect(token);
    socketRef.current = socket;

    // Handle connection status
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleError = (error: { message: string }) => {
      setConnectionError(error.message);
    };

    websocketService.on('connected', handleConnected);
    websocketService.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [token]);

  const checkUsername = useCallback(
    async (username: string) => {
      try {
        return await websocketService.checkUsername(username);
      } catch (error) {
        console.error('Failed to check username:', error);
        throw error;
      }
    },
    []
  );

  const sendConversationMessage = useCallback(
    async (conversationId: string, message: string, role: string) => {
      try {
        return await websocketService.sendConversationMessage(
          conversationId,
          message,
          role
        );
      } catch (error) {
        console.error('Failed to send conversation message:', error);
        throw error;
      }
    },
    []
  );

  const on = useCallback(
    <K extends keyof WebSocketEvents>(
      event: K,
      callback: WebSocketEvents[K]
    ) => {
      websocketService.on(event, callback);
    },
    []
  );

  const off = useCallback(
    <K extends keyof WebSocketEvents>(
      event: K,
      callback?: WebSocketEvents[K]
    ) => {
      websocketService.off(event, callback);
    },
    []
  );

  return {
    isConnected,
    connectionError,
    checkUsername,
    sendConversationMessage,
    on,
    off,
    socket: socketRef.current,
  };
}

// Hook for admin-specific WebSocket events
export function useAdminWebSocket() {
  const { on, off, ...rest } = useWebSocket();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  useEffect(() => {
    const handleNewPendingUser = (data: any) => {
      setPendingUsers(prev => [...prev, data]);
    };

    on('admin:newPendingUser', handleNewPendingUser);

    return () => {
      off('admin:newPendingUser', handleNewPendingUser);
    };
  }, [on, off]);

  return {
    ...rest,
    pendingUsers,
    on,
    off,
  };
}

// Hook for onboarding progress
export function useOnboardingProgress() {
  const { on, off, ...rest } = useWebSocket();
  const [progress, setProgress] = useState<{
    stage: string;
    progress: number;
  } | null>(null);

  useEffect(() => {
    const handleProgress = (data: any) => {
      setProgress({
        stage: data.stage,
        progress: data.progress,
      });
    };

    on('onboarding:progress', handleProgress);

    return () => {
      off('onboarding:progress', handleProgress);
    };
  }, [on, off]);

  return {
    ...rest,
    progress,
    on,
    off,
  };
}