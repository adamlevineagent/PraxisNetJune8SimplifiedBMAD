import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';

@ApiTags('onboarding')
@Controller('api/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start onboarding conversation' })
  @ApiResponse({ status: 200, description: 'Return conversation ID and initial greeting' })
  async startOnboarding(
    @Request() req,
    @Body() body: { agentName: string; communicationStyle?: string },
  ) {
    return this.onboardingService.startOnboarding(
      req.user.id,
      body.agentName,
      body.communicationStyle,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('message')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send message in onboarding conversation' })
  @ApiResponse({ status: 200, description: 'Return AI response and conversation progress' })
  async sendMessage(
    @Request() req,
    @Body() body: { 
      conversationId: string;
      message: string;
    },
  ) {
    return this.onboardingService.processMessage(
      req.user.id,
      body.conversationId,
      body.message,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete onboarding and extract Professional Essence' })
  @ApiResponse({ status: 200, description: 'Return extraction status and Professional Essence' })
  async completeOnboarding(
    @Request() req,
    @Body() body: { conversationId: string },
  ) {
    return this.onboardingService.completeOnboarding(
      req.user.id,
      body.conversationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:conversationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get onboarding conversation status' })
  @ApiResponse({ status: 200, description: 'Return conversation status and progress' })
  async getStatus(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.onboardingService.getConversationStatus(
      req.user.id,
      conversationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('interview')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process onboarding interview response' })
  @ApiResponse({ status: 200, description: 'Return AI response and updated position matrix' })
  async processInterviewResponse(
    @Request() req,
    @Body() body: { 
      question: string; 
      answer: string; 
      conversationHistory: Array<{ role: string; content: string }>;
    },
  ) {
    return this.onboardingService.processInterviewResponse(
      req.user.id,
      body.question,
      body.answer,
      body.conversationHistory,
    );
  }
}
