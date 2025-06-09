import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../api/auth/guards/admin.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('check-handle/:handle')
  @ApiOperation({ summary: 'Check if handle is available' })
  @ApiResponse({ status: 200, description: 'Return handle availability' })
  async checkHandle(@Param('handle') handle: string) {
    return this.usersService.checkHandleAvailability(handle);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user profile' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get onboarding status for current user' })
  @ApiResponse({ status: 200, description: 'Return onboarding status' })
  getOnboardingStatus(@Request() req) {
    return this.usersService.getOnboardingStatus(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('onboarding-stage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update onboarding stage for current user' })
  @ApiResponse({ status: 200, description: 'Return updated user' })
  updateOnboardingStage(@Request() req, @Body() body: { stage: string }) {
    return this.usersService.updateOnboardingStage(req.user.id, body.stage);
  }

  @UseGuards(JwtAuthGuard)
  @Get('opportunities')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get opportunities for current user' })
  @ApiResponse({ status: 200, description: 'Return opportunities for current user' })
  getOpportunities(@Request() req) {
    return this.usersService.getOpportunities(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('opportunities/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update opportunity status' })
  @ApiResponse({ status: 200, description: 'Return updated opportunity' })
  updateOpportunityStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { status: 'INTERESTED' | 'NOT_INTERESTED' },
  ) {
    return this.usersService.updateOpportunityStatus(id, req.user.id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Return updated profile' })
  updateProfile(@Request() req, @Body() body: { positionMatrix: any }) {
    return this.usersService.updateProfile(req.user.id, body.positionMatrix);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/privacy')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user privacy settings' })
  @ApiResponse({ status: 200, description: 'Return updated privacy settings' })
  updatePrivacySettings(
    @Param('id') id: string,
    @Request() req,
    @Body() body: {
      narrativeLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
      currentFocusLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
      seekingConnectionsLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
      offeringExpertiseLayer: 'PUBLIC' | 'MEMBER' | 'TRUSTED';
    },
  ) {
    // Ensure user can only update their own privacy settings
    if (id !== req.user.id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.updatePrivacySettings(id, body);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'Return updated user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'Return updated user' })
  updateStatus(@Param('id') id: string, @Body() body: { status: 'APPROVED' | 'REJECTED' | 'INACTIVE' }) {
    return this.usersService.updateStatus(id, body.status);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Return deleted user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
