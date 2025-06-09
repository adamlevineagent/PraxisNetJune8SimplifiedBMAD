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
      onboarding_interview: 'google/gemini-2.5-flash',
      agent_networking: 'google/gemini-2.5-flash',
      report_generation: 'google/gemini-2.5-flash',
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

  async extractProfessionalEssence(conversationTranscript: any[]) {
    const model = await this.getModelForTask('onboarding_interview');
    
    const prompt = `
Analyze the following conversational interview transcript and extract the user's "Professional Essence".

Conversation Transcript:
${JSON.stringify(conversationTranscript, null, 2)}

Extract and structure the following information:

1. Narrative: A compelling 2-3 paragraph summary of who this person is professionally, their journey, and what drives them.

2. Current Focus: 3-5 specific areas they're actively working on or interested in.

3. Seeking Connections: 3-5 types of people, skills, or opportunities they're looking to connect with.

4. Offering Expertise: 3-5 areas where they can provide value to others.

Return the response in the following JSON format:
{
  "narrative": "string",
  "currentFocus": ["string", "string", ...],
  "seekingConnections": ["string", "string", ...],
  "offeringExpertise": ["string", "string", ...],
  "metadata": {
    "completeness": number (0.0 to 1.0)
  }
}

Be specific and actionable in your extraction. Focus on concrete skills, experiences, and goals rather than generic statements.
`;
    
    const response = await this.openRouterService.generateCompletion(prompt, model);
    
    try {
      // Try to parse as JSON directly
      return JSON.parse(response);
    } catch (error) {
      // If parsing fails, extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create a basic structure
      return {
        narrative: response,
        currentFocus: [],
        seekingConnections: [],
        offeringExpertise: [],
        metadata: {
          completeness: 0.3,
          lastUpdated: new Date()
        }
      };
    }
  }
}
