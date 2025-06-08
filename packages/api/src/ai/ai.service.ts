import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenRouterService } from './openrouter/openrouter.service';

@Injectable()
export class AiService {
  constructor(
    private openRouterService: OpenRouterService,
    private configService: ConfigService,
  ) {}

  async getModelForTask(task: 'onboarding_interview' | 'agent_networking' | 'report_generation'): Promise<string> {
    // In a real implementation, this would fetch from the database or config service
    const defaultModels = {
      onboarding_interview: 'gpt-4',
      agent_networking: 'claude-3-opus',
      report_generation: 'gpt-4',
    };
    
    return defaultModels[task];
  }

  async conductOnboardingInterview(question: string, conversationHistory: Array<{ role: string; content: string }>) {
    const model = await this.getModelForTask('onboarding_interview');
    
    // Add the current question to the conversation history
    const messages = [
      ...conversationHistory,
      { role: 'user', content: question },
    ];
    
    return this.openRouterService.generateConversation(messages, model);
  }

  async facilitateAgentConversation(
    agent1Profile: any,
    agent2Profile: any,
  ) {
    const model = await this.getModelForTask('agent_networking');
    
    const prompt = `
You are facilitating a conversation between two AI agents representing users in the Praxis Network.

Agent 1 represents a user with the following profile:
${JSON.stringify(agent1Profile, null, 2)}

Agent 2 represents a user with the following profile:
${JSON.stringify(agent2Profile, null, 2)}

Your task is to simulate a conversation between these two agents as they explore potential collaboration opportunities.
The conversation should be focused on identifying synergies, shared interests, and potential ways the users could work together.

Format the conversation as a dialogue with clear speaker indicators.
At the end, provide an analysis of the potential match with a score from 0.0 to 1.0, key shared interests, and recommended next steps.

Begin the conversation now.
`;
    
    return this.openRouterService.generateCompletion(prompt, model, 0.7, 2000);
  }

  async generateMorningReport(opportunities: any[], userProfile: any) {
    const model = await this.getModelForTask('report_generation');
    
    const prompt = `
Generate a personalized "Morning Report" email for a user of the Praxis Network.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Opportunities discovered (${opportunities.length}):
${JSON.stringify(opportunities, null, 2)}

Create a friendly, professional email that:
1. Greets the user by their handle
2. Provides a brief summary of networking activity
3. Presents each opportunity with a clear explanation of why it might be a good match
4. Encourages the user to express interest in opportunities that resonate with them
5. Has a professional sign-off

Format the email with appropriate HTML tags for a clean presentation.
`;
    
    return this.openRouterService.generateCompletion(prompt, model);
  }
}
