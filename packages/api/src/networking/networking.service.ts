import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NetworkingService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private configService: ConfigService,
  ) {}

  async runNetworkingBatch() {
    // Get batch configuration
    const batchConfig = await this.getBatchConfig();
    
    // Get all approved users with profiles
    const users = await this.prisma.user.findMany({
      where: {
        status: 'APPROVED',
        profile: {
          isNot: null,
        },
      },
      include: {
        profile: true,
      },
    });
    
    // Create conversation pairs
    const pairs = await this.createConversationPairs(users, batchConfig);
    
    // Process each pair
    const results = [];
    for (const pair of pairs) {
      const result = await this.processConversationPair(pair.user1, pair.user2);
      results.push(result);
    }
    
    return {
      batchSize: pairs.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
    };
  }

  private async getBatchConfig() {
    // In a real implementation, this would fetch from the database
    return {
      start_time: '01:00',
      max_duration_hours: 6,
      conversations_per_agent: 5,
      targeted_ratio: 0.6,
      serendipitous_ratio: 0.4,
    };
  }

  private async createConversationPairs(users, batchConfig) {
    const pairs = [];
    const maxPairsPerUser = batchConfig.conversations_per_agent;
    
    // Create a map to track how many conversations each user has
    const userConversationCount = new Map();
    users.forEach(user => userConversationCount.set(user.id, 0));
    
    // Create pairs until we reach the maximum for each user
    for (let i = 0; i < users.length; i++) {
      const user1 = users[i];
      
      // Skip if user1 has reached their maximum
      if (userConversationCount.get(user1.id) >= maxPairsPerUser) {
        continue;
      }
      
      for (let j = i + 1; j < users.length; j++) {
        const user2 = users[j];
        
        // Skip if user2 has reached their maximum
        if (userConversationCount.get(user2.id) >= maxPairsPerUser) {
          continue;
        }
        
        // Check if this pair has already had a conversation
        const existingConversation = await this.checkExistingConversation(user1.id, user2.id);
        if (existingConversation) {
          continue;
        }
        
        // Add the pair
        pairs.push({ user1, user2 });
        
        // Update conversation counts
        userConversationCount.set(user1.id, userConversationCount.get(user1.id) + 1);
        userConversationCount.set(user2.id, userConversationCount.get(user2.id) + 1);
        
        // Break if user1 has reached their maximum
        if (userConversationCount.get(user1.id) >= maxPairsPerUser) {
          break;
        }
      }
    }
    
    return pairs;
  }

  private async checkExistingConversation(user1Id: string, user2Id: string) {
    // Check if these users have already had a conversation
    const existingConversation = await this.prisma.conversationParticipant.findFirst({
      where: {
        profile: {
          userId: user1Id,
        },
        conversation: {
          participants: {
            some: {
              profile: {
                userId: user2Id,
              },
            },
          },
        },
      },
    });
    
    return !!existingConversation;
  }

  private async processConversationPair(user1: any, user2: any) {
    try {
      // Generate conversation between agents
      const conversationText = await this.aiService.facilitateAgentConversation(
        user1.profile.positionMatrix,
        user2.profile.positionMatrix,
      );
      
      // Parse the conversation to extract match score and summaries
      const { matchScore, summaries } = this.parseConversationOutput(conversationText);
      
      // Create conversation log
      const conversationLog = await this.prisma.conversationLog.create({
        data: {
          transcript: conversationText,
          outcomes: {
            matchScore,
            summaries,
          },
          participants: {
            create: [
              {
                profileId: user1.profile.id,
              },
              {
                profileId: user2.profile.id,
              },
            ],
          },
        },
      });
      
      // Create opportunity matches if score is above threshold
      if (matchScore >= 0.5) {
        await this.createOpportunityMatches(
          conversationLog.id,
          user1.id,
          user2.id,
          summaries,
        );
      }
      
      return {
        success: true,
        conversationId: conversationLog.id,
        matchScore,
      };
    } catch (error) {
      console.error('Error processing conversation pair:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private parseConversationOutput(conversationText: string) {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated parsing techniques
    
    // Extract match score - look for a score between 0.0 and 1.0
    const scoreRegex = /score[:\s]+([0-9]\.[0-9])/i;
    const scoreMatch = conversationText.match(scoreRegex);
    const matchScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0.5;
    
    // Extract summaries - simplified approach
    const summaries = {
      user1ToUser2: this.extractSummary(conversationText, 'user1', 'user2'),
      user2ToUser1: this.extractSummary(conversationText, 'user2', 'user1'),
    };
    
    return { matchScore, summaries };
  }

  private extractSummary(text: string, fromUser: string, toUser: string) {
    // In a real implementation, this would use more sophisticated NLP techniques
    // For now, just return a generic summary based on the conversation text
    
    const sentences = text.split(/[.!?]+/);
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes('collaboration') || 
      s.toLowerCase().includes('opportunity') ||
      s.toLowerCase().includes('interest')
    );
    
    if (relevantSentences.length > 0) {
      return relevantSentences.slice(0, 3).join('. ') + '.';
    }
    
    return 'Potential collaboration opportunity based on shared interests and complementary skills.';
  }

  private async createOpportunityMatches(
    conversationId: string,
    user1Id: string,
    user2Id: string,
    summaries: any,
  ) {
    // Create opportunity match for user1
    await this.prisma.opportunityMatch.create({
      data: {
        conversationId,
        userId: user1Id,
        targetUserId: user2Id,
        summary: summaries.user2ToUser1,
        status: 'PENDING',
      },
    });
    
    // Create opportunity match for user2
    await this.prisma.opportunityMatch.create({
      data: {
        conversationId,
        userId: user2Id,
        targetUserId: user1Id,
        summary: summaries.user1ToUser2,
        status: 'PENDING',
      },
    });
  }
}
