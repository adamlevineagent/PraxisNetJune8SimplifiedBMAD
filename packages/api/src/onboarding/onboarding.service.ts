import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { AgentsService } from '../agents/agents.service';
import { ProfessionalEssenceService } from '../professional-essence/professional-essence.service';
import { v4 as uuidv4 } from 'uuid';

interface ConversationState {
  conversationId: string;
  userId: string;
  agentName: string;
  communicationStyle: string;
  transcript: Array<{ role: string; content: string }>;
  turnCount: number;
  startedAt: Date;
}

@Injectable()
export class OnboardingService {
  private conversations = new Map<string, ConversationState>();

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private agentsService: AgentsService,
    private professionalEssenceService: ProfessionalEssenceService,
  ) {}

  async startOnboarding(userId: string, agentName: string, communicationStyle?: string) {
    const conversationId = uuidv4();
    const style = communicationStyle || 'warm_conversational';
    
    // Create or update agent profile
    await this.agentsService.personalizeAgent(userId, {
      agentName: agentName,
      communicationStyle: style as any,
    });

    // Initialize conversation state
    const conversationState: ConversationState = {
      conversationId,
      userId,
      agentName,
      communicationStyle: style,
      transcript: [],
      turnCount: 0,
      startedAt: new Date(),
    };

    this.conversations.set(conversationId, conversationState);

    // Generate initial greeting based on agent personality
    const greeting = this.generateGreeting(agentName, style);

    conversationState.transcript.push({ role: 'assistant', content: greeting });

    // Save initial conversation state to database
    await this.saveConversationState(conversationState);

    return {
      conversationId,
      greeting,
      agentName,
      communicationStyle: style,
    };
  }

  async processMessage(userId: string, conversationId: string, message: string) {
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      // Try to load from database
      conversation = await this.loadConversationState(userId, conversationId);
      
      if (!conversation || conversation.userId !== userId) {
        throw new NotFoundException('Conversation not found');
      }
    }

    // Add user message to transcript
    conversation.transcript.push({ role: 'user', content: message });

    // Generate AI response
    const systemPrompt = this.generateSystemPrompt(conversation.agentName, conversation.communicationStyle);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.transcript,
    ];

    const aiResponse = await this.aiService.conductOnboardingInterview(message, messages);
    
    // Add AI response to transcript
    conversation.transcript.push({ role: 'assistant', content: aiResponse.content });
    conversation.turnCount++;

    // Save updated conversation state
    await this.saveConversationState(conversation);

    // Calculate progress
    const progress = this.calculateProgress(conversation);

    return {
      response: aiResponse.content,
      turnCount: conversation.turnCount,
      progress,
      isComplete: progress.completeness >= 0.7,
    };
  }

  async completeOnboarding(userId: string, conversationId: string) {
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      // Try to load from database
      conversation = await this.loadConversationState(userId, conversationId);
      
      if (!conversation || conversation.userId !== userId) {
        throw new NotFoundException('Conversation not found');
      }
    }

    // Extract Professional Essence from conversation
    const essence = await this.professionalEssenceService.extractEssenceFromConversation(
      conversation.transcript
    );

    // Update user's Professional Essence
    await this.professionalEssenceService.updateProfessionalEssence(userId, essence);

    // Update user status to pending approval
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'PENDING_APPROVAL',
        onboardingStage: 'AWAITING_APPROVAL',
      },
    });

    // Mark conversation as complete in database
    await this.prisma.onboardingConversation.update({
      where: { conversationId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Clean up conversation state from memory
    this.conversations.delete(conversationId);

    return {
      success: true,
      essence,
      status: 'PENDING_APPROVAL',
    };
  }

  async getConversationStatus(userId: string, conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    const progress = this.calculateProgress(conversation);

    return {
      conversationId,
      turnCount: conversation.turnCount,
      progress,
      isComplete: progress.completeness >= 0.7,
      startedAt: conversation.startedAt,
      duration: new Date().getTime() - conversation.startedAt.getTime(),
    };
  }

  private generateGreeting(agentName: string, style: string): string {
    const greetings = {
      professional_focused: `Hello! I'm ${agentName}, your Praxis Network agent. I'm here to help you articulate your professional identity and discover collaboration opportunities. Let's begin by discussing your current professional focus. What projects or initiatives are capturing most of your attention these days?`,
      warm_conversational: `Hi! I'm ${agentName}, your Praxis agent. I'm excited to learn about your professional journey and help you discover amazing collaboration opportunities. Let's start with what's got your professional attention these days - what are you working on that really energizes you?`,
      direct_efficient: `I'm ${agentName}, your Praxis agent. Let's build your Professional Essence efficiently. First question: What are your current professional projects and primary areas of expertise?`,
    };

    return greetings[style] || greetings.warm_conversational;
  }

  private generateSystemPrompt(agentName: string, style: string): string {
    const basePrompt = `You are ${agentName}, a Praxis Network AI agent conducting an onboarding interview to extract the user's Professional Essence. Your goal is to understand:

1. Their professional narrative and journey
2. Current projects and focus areas
3. Skills and expertise they can offer
4. Types of collaborations they're seeking
5. Their ideal collaborator profile

Guide the conversation naturally, asking follow-up questions to dive deeper into interesting areas. Aim to complete the interview in 10-15 exchanges.`;

    const styleModifiers = {
      professional_focused: '\n\nMaintain a professional, focused tone. Ask clear, specific questions about their work and expertise.',
      warm_conversational: '\n\nBe warm, conversational, and encouraging. Show genuine interest in their work and make them feel comfortable sharing.',
      direct_efficient: '\n\nBe direct and efficient. Ask concise questions that get to the core of their professional identity quickly.',
    };

    return basePrompt + (styleModifiers[style] || styleModifiers.warm_conversational);
  }

  private calculateProgress(conversation: ConversationState) {
    const transcript = conversation.transcript;
    let narrative = 0;
    let currentFocus = 0;
    let seeking = 0;
    let offering = 0;

    // Simple heuristic-based progress calculation
    for (const message of transcript) {
      if (message.role === 'user') {
        const content = message.content.toLowerCase();
        
        if (content.length > 100) narrative = Math.min(narrative + 0.2, 1);
        if (content.includes('working on') || content.includes('project')) currentFocus = Math.min(currentFocus + 0.3, 1);
        if (content.includes('looking for') || content.includes('seeking')) seeking = Math.min(seeking + 0.3, 1);
        if (content.includes('help with') || content.includes('expertise')) offering = Math.min(offering + 0.3, 1);
      }
    }

    const completeness = (narrative + currentFocus + seeking + offering) / 4;

    return {
      completeness,
      narrative,
      currentFocus,
      seeking,
      offering,
    };
  }

  async processInterviewResponse(userId: string, question: string, answer: string, conversationHistory: any[]) {
    // Add the current Q&A to the conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: answer },
    ];
    
    // Get AI response for the next question
    const aiResponse = await this.aiService.conductOnboardingInterview(
      question,
      updatedHistory,
    );
    
    // Extract position matrix data from the conversation
    // In a real implementation, this would use more sophisticated logic
    // to build the position matrix based on the entire conversation
    const extractedData = this.extractDataFromAnswer(question, answer);
    
    // Get existing position matrix or create a new one
    const existingProfile = await this.prisma.agentProfile.findUnique({
      where: { userId },
    });
    
    const currentMatrix = existingProfile?.positionMatrix as any || {
      archetype: '',
      skills: [],
      projects: [],
      goals: '',
      idealCollaborator: '',
      notes: '',
    };
    
    // Update position matrix with new data
    const updatedMatrix = {
      ...currentMatrix,
      ...extractedData,
    };
    
    // Save updated position matrix
    if (existingProfile) {
      await this.prisma.agentProfile.update({
        where: { userId },
        data: {
          positionMatrix: updatedMatrix,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.agentProfile.create({
        data: {
          userId,
          positionMatrix: updatedMatrix,
        },
      });
    }
    
    return {
      aiResponse: aiResponse.content,
      updatedPositionMatrix: updatedMatrix,
      updatedHistory: [
        ...updatedHistory,
        { role: 'assistant', content: aiResponse.content },
      ],
    };
  }

  private extractDataFromAnswer(question: string, answer: string) {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated NLP techniques
    
    if (question.includes('archetype')) {
      const archetypeMap = {
        builder: 'BUILDER',
        visionary: 'VISIONARY',
        specialist: 'SPECIALIST',
        connector: 'CONNECTOR',
      };
      
      const lowerAnswer = answer.toLowerCase();
      for (const [key, value] of Object.entries(archetypeMap)) {
        if (lowerAnswer.includes(key)) {
          return { archetype: value };
        }
      }
      return { archetype: 'OTHER' };
    }
    
    if (question.includes('skills') || question.includes('expertise')) {
      // Extract skills by splitting on commas or newlines
      const skills = answer
        .split(/[,\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      return { skills };
    }
    
    if (question.includes('projects') || question.includes('ventures')) {
      // Extract project information
      const projectName = answer.split('\n')[0] || answer.substring(0, 50);
      
      return {
        projects: [
          {
            name: projectName,
            description: answer,
            url: this.extractUrl(answer),
          },
        ],
      };
    }
    
    if (question.includes('collaborations') || question.includes('looking for')) {
      return { goals: answer };
    }
    
    if (question.includes('ideal collaborator')) {
      return { idealCollaborator: answer };
    }
    
    // Default case - store in notes
    return { notes: answer };
  }

  private extractUrl(text: string): string {
    // Simple regex to extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    return matches ? matches[0] : '';
  }

  // Database persistence methods
  private async saveConversationState(conversationState: ConversationState) {
    try {
      await this.prisma.onboardingConversation.upsert({
        where: { 
          conversationId: conversationState.conversationId 
        },
        create: {
          userId: conversationState.userId,
          conversationId: conversationState.conversationId,
          agentName: conversationState.agentName,
          communicationStyle: conversationState.communicationStyle,
          transcript: conversationState.transcript,
          turnCount: conversationState.turnCount,
          startedAt: conversationState.startedAt,
          status: 'IN_PROGRESS',
        },
        update: {
          transcript: conversationState.transcript,
          turnCount: conversationState.turnCount,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to save conversation state:', error);
      // Don't throw - allow conversation to continue even if persistence fails
    }
  }

  async loadConversationState(userId: string, conversationId: string): Promise<ConversationState | null> {
    try {
      const conversation = await this.prisma.onboardingConversation.findUnique({
        where: { 
          conversationId: conversationId,
          userId: userId,
        },
      });

      if (!conversation) {
        return null;
      }

      // Restore conversation state from database
      const conversationState: ConversationState = {
        conversationId: conversation.conversationId,
        userId: conversation.userId,
        agentName: conversation.agentName,
        communicationStyle: conversation.communicationStyle,
        transcript: (conversation.transcript as any) || [],
        turnCount: conversation.turnCount,
        startedAt: conversation.startedAt,
      };

      // Add to memory cache
      this.conversations.set(conversationId, conversationState);

      return conversationState;
    } catch (error) {
      console.error('Failed to load conversation state:', error);
      return null;
    }
  }

  async cleanupAbandonedConversations() {
    try {
      // Find conversations older than 24 hours that are still in progress
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - 24);

      const result = await this.prisma.onboardingConversation.updateMany({
        where: {
          status: 'IN_PROGRESS',
          updatedAt: { lt: cutoffDate },
        },
        data: {
          status: 'ABANDONED',
          updatedAt: new Date(),
        },
      });

      console.log(`Cleaned up ${result.count} abandoned conversations`);
    } catch (error) {
      console.error('Failed to cleanup abandoned conversations:', error);
    }
  }

  async getConversationHistory(userId: string, conversationId: string) {
    // First check memory cache
    let conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      // Try to load from database
      conversation = await this.loadConversationState(userId, conversationId);
      
      if (!conversation || conversation.userId !== userId) {
        throw new NotFoundException('Conversation not found');
      }
    }

    return {
      conversationId: conversation.conversationId,
      agentName: conversation.agentName,
      communicationStyle: conversation.communicationStyle,
      transcript: conversation.transcript,
      turnCount: conversation.turnCount,
      startedAt: conversation.startedAt,
      progress: this.calculateProgress(conversation),
    };
  }
}
