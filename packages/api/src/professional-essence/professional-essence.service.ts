import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

export interface ProfessionalEssence {
  narrative: string;
  currentFocus: string[];
  seekingConnections: string[];
  offeringExpertise: string[];
  metadata: {
    completeness: number;
    lastUpdated: Date;
  };
}

@Injectable()
export class ProfessionalEssenceService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getProfessionalEssence(userId: string): Promise<ProfessionalEssence | null> {
    const profile = await this.prisma.agentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    const positionMatrix = profile.positionMatrix as any;
    
    // Extract professional essence from position matrix
    return {
      narrative: positionMatrix.narrative || '',
      currentFocus: positionMatrix.currentFocus || [],
      seekingConnections: positionMatrix.seekingConnections || [],
      offeringExpertise: positionMatrix.offeringExpertise || [],
      metadata: {
        completeness: positionMatrix.metadata?.completeness || 0,
        lastUpdated: positionMatrix.metadata?.lastUpdated || profile.updatedAt,
      },
    };
  }

  async updateProfessionalEssence(userId: string, essence: Partial<ProfessionalEssence>) {
    // Get existing profile
    const existingProfile = await this.prisma.agentProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Agent profile not found');
    }

    const currentMatrix = existingProfile.positionMatrix as any || {};
    
    // Merge essence data into position matrix
    const updatedMatrix = {
      ...currentMatrix,
      narrative: essence.narrative ?? currentMatrix.narrative,
      currentFocus: essence.currentFocus ?? currentMatrix.currentFocus,
      seekingConnections: essence.seekingConnections ?? currentMatrix.seekingConnections,
      offeringExpertise: essence.offeringExpertise ?? currentMatrix.offeringExpertise,
      metadata: {
        completeness: essence.metadata?.completeness ?? currentMatrix.metadata?.completeness ?? 0,
        lastUpdated: new Date(),
      },
    };

    // Update the profile
    const updated = await this.prisma.agentProfile.update({
      where: { userId },
      data: {
        positionMatrix: updatedMatrix,
      },
    });

    return this.getProfessionalEssence(userId);
  }

  async extractEssenceFromConversation(conversationTranscript: any[]): Promise<ProfessionalEssence> {
    // Use AI to extract professional essence from conversation
    const extraction = await this.aiService.extractProfessionalEssence(conversationTranscript);
    
    return extraction;
  }

  calculateCompleteness(essence: ProfessionalEssence): number {
    let score = 0;
    const weights = {
      narrative: 0.3,
      currentFocus: 0.25,
      seekingConnections: 0.25,
      offeringExpertise: 0.2,
    };

    // Check narrative
    if (essence.narrative && essence.narrative.length > 100) {
      score += weights.narrative;
    }

    // Check current focus
    if (essence.currentFocus && essence.currentFocus.length >= 2) {
      score += weights.currentFocus;
    }

    // Check seeking connections
    if (essence.seekingConnections && essence.seekingConnections.length >= 2) {
      score += weights.seekingConnections;
    }

    // Check offering expertise
    if (essence.offeringExpertise && essence.offeringExpertise.length >= 2) {
      score += weights.offeringExpertise;
    }

    return Math.round(score * 100) / 100;
  }
}