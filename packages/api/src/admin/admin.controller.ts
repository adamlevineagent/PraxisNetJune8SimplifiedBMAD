import { Controller, Get, Post, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from '../api/auth/guards/admin.guard';

@ApiTags('admin')
@Controller('api/admin')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pending-users')
  @ApiOperation({ summary: 'Get pending users awaiting approval' })
  @ApiResponse({ status: 200, description: 'Return list of pending users' })
  async getPendingUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminService.getPendingUsers(+page, +limit);
  }

  @Get('users/:id/essence')
  @ApiOperation({ summary: 'Get user professional essence for review' })
  @ApiResponse({ status: 200, description: 'Return user with professional essence' })
  async getUserEssence(@Param('id') userId: string) {
    return this.adminService.getUserEssenceForReview(userId);
  }

  @Post('users/:id/approve')
  @ApiOperation({ summary: 'Approve user' })
  @ApiResponse({ status: 200, description: 'User approved successfully' })
  async approveUser(
    @Param('id') userId: string,
    @Body() body: { adminNotes?: string },
  ) {
    return this.adminService.approveUser(userId, body.adminNotes);
  }

  @Post('users/:id/request-info')
  @ApiOperation({ summary: 'Request more information from user' })
  @ApiResponse({ status: 200, description: 'Request sent successfully' })
  async requestMoreInfo(
    @Param('id') userId: string,
    @Body() body: { feedback: string },
  ) {
    return this.adminService.requestMoreInfo(userId, body.feedback);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get admin dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Return approval metrics' })
  async getMetrics() {
    return this.adminService.getApprovalMetrics();
  }

  @Get('system-status')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'Return system status' })
  async getSystemStatus() {
    return this.adminService.getSystemStatus();
  }
}