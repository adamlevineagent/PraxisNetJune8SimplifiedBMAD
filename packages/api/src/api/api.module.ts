import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { AdminController } from './admin/admin.controller';
import { OnboardingController } from './onboarding/onboarding.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from '../users/users.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { AdminService } from '../admin/admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    AiModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
    AdminController,
    OnboardingController,
  ],
  providers: [
    AuthService,
    UsersService,
    OnboardingService,
    AdminService,
  ],
  exports: [AuthService],
})
export class ApiModule {}
