import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://openrouter.ai/api/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
  }

  async generateCompletion(
    prompt: string,
    model: string = 'google/gemini-2.5-flash-preview-05-20',
    temperature: number = 0.7,
    maxTokens: number = 1000,
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error.response?.data || error.message);
      throw new Error('Failed to generate completion from OpenRouter');
    }
  }

  async generateConversation(
    messages: Array<{ role: string; content: string }>,
    model: string = 'google/gemini-2.5-flash-preview-05-20',
    temperature: number = 0.7,
    maxTokens: number = 1000,
  ) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].message;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error.response?.data || error.message);
      throw new Error('Failed to generate conversation from OpenRouter');
    }
  }
}
