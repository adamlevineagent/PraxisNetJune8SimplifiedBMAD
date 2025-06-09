import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { PersonalizeAgentDto } from './dto/personalize-agent.dto';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('personalize')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Personalize user agent' })
  @ApiResponse({ status: 200, description: 'Agent personalized successfully' })
  async personalizeAgent(@Request() req, @Body() dto: PersonalizeAgentDto) {
    const result = await this.agentsService.personalizeAgent(req.user.id, dto);
    
    // Generate greeting for the response
    const greeting = this.agentsService.generateAgentGreeting(
      dto.agentName,
      dto.communicationStyle
    );

    return {
      ...result,
      greeting,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user agent profile' })
  @ApiResponse({ status: 200, description: 'Return agent profile' })
  async getMyAgent(@Request() req) {
    return this.agentsService.getAgentProfile(req.user.id);
  }
}