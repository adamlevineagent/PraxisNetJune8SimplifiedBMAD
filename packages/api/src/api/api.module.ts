import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersController } from '../users/users.controller';
import { OnboardingController } from '../onboarding/onboarding.controller';
import { UsersService } from '../users/users.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { AgentsModule } from '../agents/agents.module';
import { ProfessionalEssenceModule } from '../professional-essence/professional-essence.module';

@Module({
  imports: [
    PrismaModule,
    AiModule,
    AuthModule,
    AgentsModule,
    ProfessionalEssenceModule,
  ],
  controllers: [
    AuthController,
    UsersController,
    OnboardingController,
  ],
  providers: [
    UsersService,
    OnboardingService,
  ],
  exports: [],
})
export class ApiModule {}
