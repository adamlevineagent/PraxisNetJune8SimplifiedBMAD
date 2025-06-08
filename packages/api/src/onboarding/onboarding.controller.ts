import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';

@ApiTags('onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

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
