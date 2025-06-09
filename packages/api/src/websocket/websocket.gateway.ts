import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WsJwtGuard } from './ws-jwt.guard';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  isAdmin?: boolean;
}

@Injectable()
@WSGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/ws',
})
export class WebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract JWT token from handshake
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        throw new WsException('No authentication token provided');
      }

      // Verify JWT token
      const payload = await this.verifyToken(token);
      if (!payload) {
        throw new WsException('Invalid authentication token');
      }

      // Attach user info to socket
      client.userId = payload.sub;
      client.isAdmin = payload.isAdmin || false;

      // Store connected client
      this.connectedClients.set(client.id, client);

      // Join user-specific room
      client.join(`user:${client.userId}`);
      
      // Join admin room if admin
      if (client.isAdmin) {
        client.join('admin');
      }

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);

      // Send connection success
      client.emit('connected', { userId: client.userId });

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.emit('error', { message: error.message });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Check username availability in real-time
   */
  @SubscribeMessage('checkUsername')
  async handleCheckUsername(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { username } = data;
      
      if (!username || username.length < 3) {
        return { available: false, message: 'Username too short' };
      }

      const isAvailable = await this.usersService.isUsernameAvailable(username);
      
      return {
        available: isAvailable,
        message: isAvailable ? 'Username available' : 'Username already taken',
      };
    } catch (error) {
      this.logger.error(`Error checking username: ${error.message}`);
      throw new WsException('Failed to check username availability');
    }
  }

  /**
   * Handle onboarding conversation updates
   */
  @SubscribeMessage('conversation:message')
  @UseGuards(WsJwtGuard)
  async handleConversationMessage(
    @MessageBody() data: { conversationId: string; message: string; role: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      // Emit to the specific user's room
      this.server.to(`user:${client.userId}`).emit('conversation:update', {
        conversationId: data.conversationId,
        message: data.message,
        role: data.role,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling conversation message: ${error.message}`);
      throw new WsException('Failed to process conversation message');
    }
  }

  /**
   * Notify admins of new pending users
   */
  notifyAdminsNewPendingUser(userData: {
    userId: string;
    username: string;
    email: string;
  }) {
    this.server.to('admin').emit('admin:newPendingUser', {
      ...userData,
      timestamp: new Date(),
    });
  }

  /**
   * Notify user of approval status change
   */
  notifyUserStatusChange(userId: string, status: string, message?: string) {
    this.server.to(`user:${userId}`).emit('user:statusUpdate', {
      status,
      message,
      timestamp: new Date(),
    });
  }

  /**
   * Send onboarding progress updates
   */
  sendOnboardingProgress(userId: string, stage: string, progress: number) {
    this.server.to(`user:${userId}`).emit('onboarding:progress', {
      stage,
      progress,
      timestamp: new Date(),
    });
  }

  /**
   * Extract JWT token from WebSocket handshake
   */
  private extractTokenFromHandshake(client: Socket): string | null {
    // Check Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check query parameters
    const token = client.handshake.query.token as string;
    if (token) {
      return token;
    }

    // Check auth object in handshake
    const auth = client.handshake.auth;
    if (auth && auth.token) {
      return auth.token;
    }

    return null;
  }

  /**
   * Verify JWT token
   */
  private async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      return null;
    }
  }
}