import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

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
    
    const currentMatrix = existingProfile?.positionMatrix || {
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
}
