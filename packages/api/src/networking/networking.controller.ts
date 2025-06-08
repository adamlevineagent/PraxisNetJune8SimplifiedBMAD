import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NetworkingService } from './networking.service';
import { AdminGuard } from '../api/auth/guards/admin.guard';

@ApiTags('networking')
@Controller('networking')
export class NetworkingController {
  constructor(private readonly networkingService: NetworkingService) {}

  @UseGuards(AdminGuard)
  @Post('batch')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Run networking batch process' })
  @ApiResponse({ status: 200, description: 'Return batch processing results' })
  async runNetworkingBatch() {
    return this.networkingService.runNetworkingBatch();
  }
}
