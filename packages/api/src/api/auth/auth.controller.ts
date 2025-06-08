import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AdminLocalAuthGuard } from './guards/admin-local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Return JWT token and user info' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Return JWT token and user info' })
  async register(
    @Body() body: { email: string; password: string; handle: string; disclosureLevel?: 'OPEN' | 'STEALTH' },
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.handle,
      body.disclosureLevel,
    );
  }

  @UseGuards(AdminLocalAuthGuard)
  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Return JWT token and admin info' })
  async adminLogin(@Request() req) {
    return this.authService.adminLogin(req.user);
  }
}
