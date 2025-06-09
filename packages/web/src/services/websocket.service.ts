import { io, Socket } from 'socket.io-client';

export interface WebSocketEvents {
  // Connection events
  connected: (data: { userId: string }) => void;
  error: (error: { message: string }) => void;
  
  // User events
  'user:statusUpdate': (data: {
    status: string;
    message?: string;
    timestamp: Date;
  }) => void;
  
  // Onboarding events
  'onboarding:progress': (data: {
    stage: string;
    progress: number;
    timestamp: Date;
  }) => void;
  
  // Conversation events
  'conversation:update': (data: {
    conversationId: string;
    message: string;
    role: string;
    timestamp: Date;
  }) => void;
  
  // Admin events
  'admin:newPendingUser': (data: {
    userId: string;
    username: string;
    email: string;
    timestamp: Date;
  }) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    
    this.socket = io(`${wsUrl}/ws`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupConnectionHandlers();
    
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupConnectionHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  on<K extends keyof WebSocketEvents>(
    event: K,
    callback: WebSocketEvents[K]
  ): void {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }
    
    this.socket.on(event, callback as any);
  }

  off<K extends keyof WebSocketEvents>(
    event: K,
    callback?: WebSocketEvents[K]
  ): void {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback as any);
    } else {
      this.socket.off(event);
    }
  }

  emit(event: string, data: any, callback?: (response: any) => void): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }
    
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  checkUsername(username: string): Promise<{
    available: boolean;
    message: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      this.socket.emit('checkUsername', { username }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  sendConversationMessage(
    conversationId: string,
    message: string,
    role: string
  ): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      this.socket.emit(
        'conversation:message',
        { conversationId, message, role },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

// Export type for use in components
export type { Socket } from 'socket.io-client';