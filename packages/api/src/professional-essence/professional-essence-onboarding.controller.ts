import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessionalEssenceService, ProfessionalEssence } from './professional-essence.service';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('professional-essence')
@Controller('professional-essence')
export class ProfessionalEssenceOnboardingController {
  constructor(
    private readonly essenceService: ProfessionalEssenceService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create professional essence during onboarding' })
  @ApiResponse({ status: 201, description: 'Professional essence created' })
  async createEssence(@Request() req, @Body() essence: Partial<ProfessionalEssence>) {
    const userId = req.user.id;

    // Check if user already has professional essence
    const existingEssence = await this.prisma.professionalEssence.findUnique({
      where: { userId },
    });

    if (existingEssence) {
      // Update existing essence
      return this.prisma.professionalEssence.update({
        where: { userId },
        data: {
          narrative: essence.narrative || '',
          currentFocus: essence.currentFocus || [],
          seekingConnections: essence.seekingConnections || [],
          offeringExpertise: essence.offeringExpertise || [],
          metadata: essence.metadata || { completeness: 0, lastUpdated: new Date() },
        },
      });
    }

    // Create new essence
    const newEssence = await this.prisma.professionalEssence.create({
      data: {
        userId,
        narrative: essence.narrative || '',
        currentFocus: essence.currentFocus || [],
        seekingConnections: essence.seekingConnections || [],
        offeringExpertise: essence.offeringExpertise || [],
        metadata: essence.metadata || { completeness: 0, lastUpdated: new Date() },
      },
    });

    // Also update the agent profile positionMatrix for backward compatibility
    const agentProfile = await this.prisma.agentProfile.findUnique({
      where: { userId },
    });

    if (agentProfile) {
      await this.prisma.agentProfile.update({
        where: { userId },
        data: {
          positionMatrix: {
            ...essence,
            metadata: essence.metadata || { completeness: 0, lastUpdated: new Date() },
          },
        },
      });
    }

    return newEssence;
  }
}