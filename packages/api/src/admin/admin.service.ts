import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
    @Inject(forwardRef(() => WebSocketGateway))
    private webSocketGateway: WebSocketGateway,
  ) {}

  async getPendingUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: {
          profile: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: { status: 'PENDING_APPROVAL' },
      }),
    ]);

    // Get professional essence for each user
    const usersWithEssence = await Promise.all(
      users.map(async (user) => {
        const professionalEssence = await this.prisma.professionalEssence.findUnique({
          where: { userId: user.id },
        });

        const essence = professionalEssence || {};
        
        return {
          id: user.id,
          username: user.handle,
          email: user.email,
          createdAt: user.createdAt,
          agentName: user.profile?.name || 'Unnamed Agent',
          essenceCompleteness: (essence as any).metadata?.completeness || 0,
        };
      })
    );

    return {
      users: usersWithEssence,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserEssenceForReview(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const essence = await this.prisma.professionalEssence.findUnique({
      where: { userId },
    });

    const professionalEssence = essence ? {
      narrative: essence.narrative || '',
      currentFocus: essence.currentFocus as string[] || [],
      seekingConnections: essence.seekingConnections as string[] || [],
      offeringExpertise: essence.offeringExpertise as string[] || [],
      metadata: {
        completeness: (essence.metadata as any)?.completeness || 0,
        lastUpdated: (essence.metadata as any)?.lastUpdated || essence.updatedAt,
      },
    } : {
      narrative: '',
      currentFocus: [],
      seekingConnections: [],
      offeringExpertise: [],
      metadata: {
        completeness: 0,
        lastUpdated: new Date(),
      },
    };

    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(professionalEssence);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        status: user.status,
      },
      agent: {
        name: user.profile?.name || 'Unnamed Agent',
        communicationStyle: (user.profile?.positionMatrix as any)?.communicationStyle || 'unknown',
      },
      professionalEssence,
      qualityMetrics,
    };
  }

  async approveUser(userId: string, adminNotes?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'PENDING_APPROVAL') {
      return { message: 'User is not pending approval' };
    }

    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });

    // Log admin action
    await this.logAdminAction('USER_APPROVED', userId, adminNotes);

    // Send welcome email to user
    await this.emailService.sendWelcomeEmail({
      email: user.email,
      handle: user.handle,
    });

    // Send WebSocket notification to user
    this.webSocketGateway.notifyUserStatusChange(
      userId,
      'APPROVED',
      'Your account has been approved! Welcome to Praxis Network.',
    );

    return { 
      message: 'User approved successfully',
      userId,
    };
  }

  async requestMoreInfo(userId: string, feedback: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'NEEDS_INFO' },
    });

    // Log admin action
    await this.logAdminAction('INFO_REQUESTED', userId, feedback);

    // Send email to user with feedback
    await this.emailService.sendNeedsInfoEmail(
      {
        email: user.email,
        handle: user.handle,
      },
      feedback
    );

    // Send WebSocket notification to user
    this.webSocketGateway.notifyUserStatusChange(
      userId,
      'NEEDS_INFO',
      'An admin has requested additional information. Please check your email.',
    );

    return { 
      message: 'Information request sent successfully',
      userId,
    };
  }

  async getApprovalMetrics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      pendingCount,
      approvedCount,
      needsInfoCount,
      recentApprovals,
      avgApprovalTime,
    ] = await Promise.all([
      this.prisma.user.count({ where: { status: 'PENDING_APPROVAL' } }),
      this.prisma.user.count({ 
        where: { 
          status: 'APPROVED',
          approvedAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.user.count({ where: { status: 'NEEDS_INFO' } }),
      this.prisma.user.findMany({
        where: {
          status: 'APPROVED',
          approvedAt: { gte: thirtyDaysAgo },
        },
        select: {
          createdAt: true,
          approvedAt: true,
        },
      }),
      this.calculateAverageApprovalTime(),
    ]);

    const approvalRate = recentApprovals.length > 0
      ? (approvedCount / (approvedCount + needsInfoCount)) * 100
      : 0;

    return {
      pending: pendingCount,
      approvedLast30Days: approvedCount,
      needsInfo: needsInfoCount,
      approvalRate: Math.round(approvalRate),
      avgApprovalTimeHours: avgApprovalTime,
      recentActivity: {
        labels: this.generateDateLabels(7),
        approvals: this.groupByDate(recentApprovals, 'approvedAt', 7),
      },
    };
  }

  async getSystemStatus() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      const dbStatus = 'connected';
      const apiStatus = 'operational';
      
      // Check AI service (would need to be implemented)
      const aiStatus = 'operational';
      
      return {
        status: 'healthy',
        services: {
          database: dbStatus,
          api: apiStatus,
          ai: aiStatus,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'degraded',
        services: {
          database: 'error',
          api: 'operational',
          ai: 'unknown',
        },
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  private async logAdminAction(action: string, targetId: string, notes?: string) {
    // Get the admin ID from the request context
    // For now, we'll use a placeholder - in production this would come from the JWT
    const adminId = 'current-admin-id'; // TODO: Get from request context
    
    await this.prisma.adminActivity.create({
      data: {
        adminId,
        action,
        targetId,
        notes,
        metadata: {
          timestamp: new Date(),
          userAgent: 'API',
        },
      },
    });
  }

  private calculateQualityMetrics(essence: any) {
    let score = 0;
    const metrics = {
      narrativeRichness: 'Low',
      completeness: essence.metadata?.completeness || 0,
      authenticitySignal: 'Unknown',
      redFlags: [] as string[],
    };

    // Check narrative richness
    if (essence.narrative?.length > 500) {
      metrics.narrativeRichness = 'High';
      score += 30;
    } else if (essence.narrative?.length > 200) {
      metrics.narrativeRichness = 'Medium';
      score += 20;
    }

    // Check completeness
    score += metrics.completeness * 40;

    // Check for red flags
    if (!essence.narrative || essence.narrative.length < 50) {
      metrics.redFlags.push('Narrative too short');
    }
    if (!essence.currentFocus || essence.currentFocus.length === 0) {
      metrics.redFlags.push('No current focus specified');
    }
    if (!essence.seekingConnections || essence.seekingConnections.length === 0) {
      metrics.redFlags.push('No collaboration preferences');
    }

    // Authenticity signal (simplified)
    if (score > 60 && metrics.redFlags.length === 0) {
      metrics.authenticitySignal = 'Strong';
    } else if (score > 40) {
      metrics.authenticitySignal = 'Moderate';
    } else {
      metrics.authenticitySignal = 'Weak';
    }

    return metrics;
  }

  private async calculateAverageApprovalTime(): Promise<number> {
    const recentApprovals = await this.prisma.user.findMany({
      where: {
        status: 'APPROVED',
        approvedAt: { not: null },
      },
      select: {
        createdAt: true,
        approvedAt: true,
      },
      take: 100,
      orderBy: { approvedAt: 'desc' },
    });

    if (recentApprovals.length === 0) return 0;

    const totalHours = recentApprovals.reduce((sum, user) => {
      const hours = (user.approvedAt!.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    return Math.round(totalHours / recentApprovals.length);
  }

  private generateDateLabels(days: number): string[] {
    const labels: string[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
  }

  private groupByDate(items: any[], dateField: string, days: number): number[] {
    const counts = new Array(days).fill(0);
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    items.forEach(item => {
      const itemDate = new Date(item[dateField]);
      const daysAgo = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysAgo >= 0 && daysAgo < days) {
        counts[days - 1 - daysAgo]++;
      }
    });
    
    return counts;
  }
}