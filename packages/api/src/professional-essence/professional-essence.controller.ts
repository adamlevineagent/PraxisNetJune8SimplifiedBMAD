import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessionalEssenceService, ProfessionalEssence } from './professional-essence.service';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';

@ApiTags('professional-essence')
@Controller('users/me/essence')
export class ProfessionalEssenceController {
  constructor(private readonly essenceService: ProfessionalEssenceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user professional essence' })
  @ApiResponse({ status: 200, description: 'Return professional essence' })
  async getMyEssence(@Request() req) {
    const essence = await this.essenceService.getProfessionalEssence(req.user.id);
    
    if (!essence) {
      return {
        narrative: '',
        currentFocus: [],
        seekingConnections: [],
        offeringExpertise: [],
        metadata: {
          completeness: 0,
          lastUpdated: new Date(),
        },
      };
    }

    return essence;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user professional essence' })
  @ApiResponse({ status: 200, description: 'Return updated professional essence' })
  async updateMyEssence(@Request() req, @Body() essence: Partial<ProfessionalEssence>) {
    // Calculate completeness
    const completeness = this.essenceService.calculateCompleteness({
      ...essence,
      metadata: {
        completeness: 0,
        lastUpdated: new Date(),
      },
    } as ProfessionalEssence);

    // Update essence with calculated completeness
    const updatedEssence = await this.essenceService.updateProfessionalEssence(req.user.id, {
      ...essence,
      metadata: {
        completeness,
        lastUpdated: new Date(),
      },
    });

    return updatedEssence;
  }
}