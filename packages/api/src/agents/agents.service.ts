import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PersonalizeAgentDto } from './dto/personalize-agent.dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async personalizeAgent(userId: string, dto: PersonalizeAgentDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if agent profile already exists
    const existingProfile = await this.prisma.agentProfile.findUnique({
      where: { userId },
    });

    const agentData = {
      agentName: dto.agentName,
      communicationStyle: dto.communicationStyle,
      personalizedAt: new Date(),
    };

    if (existingProfile) {
      // Update existing profile
      const updated = await this.prisma.agentProfile.update({
        where: { userId },
        data: {
          positionMatrix: {
            ...(existingProfile.positionMatrix as any),
            ...agentData,
          },
        },
      });
      return this.formatAgentResponse(updated);
    } else {
      // Create new profile
      const created = await this.prisma.agentProfile.create({
        data: {
          userId,
          positionMatrix: agentData,
        },
      });
      return this.formatAgentResponse(created);
    }
  }

  async getAgentProfile(userId: string) {
    const profile = await this.prisma.agentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }

    return this.formatAgentResponse(profile);
  }

  private formatAgentResponse(profile: any) {
    const positionMatrix = profile.positionMatrix as any || {};
    return {
      id: profile.id,
      userId: profile.userId,
      agentName: positionMatrix.agentName || null,
      communicationStyle: positionMatrix.communicationStyle || null,
      personalizedAt: positionMatrix.personalizedAt || null,
      user: profile.user || undefined,
    };
  }

  generateAgentGreeting(agentName: string, communicationStyle: string): string {
    const greetings = {
      PROFESSIONAL: `Hello! I'm ${agentName}, your Praxis Network agent. I'm here to help you build meaningful professional connections. Let's discuss your professional journey and goals.`,
      CONVERSATIONAL: `Hi! I'm ${agentName}, your Praxis agent. I'm excited to learn about your professional journey and help you discover amazing collaboration opportunities. Ready to chat?`,
      DIRECT: `I'm ${agentName}, your Praxis agent. Let's get started with understanding your professional goals and finding the right connections for you.`,
    };

    return greetings[communicationStyle] || greetings.CONVERSATIONAL;
  }
}