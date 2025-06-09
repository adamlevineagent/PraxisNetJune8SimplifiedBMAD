import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { UsersModule } from './users/users.module';
import { NetworkingModule } from './networking/networking.module';
import { AiModule } from './ai/ai.module';
import { AgentsModule } from './agents/agents.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { ProfessionalEssenceModule } from './professional-essence/professional-essence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ApiModule,
    OnboardingModule,
    UsersModule,
    NetworkingModule,
    AiModule,
    AgentsModule,
    AdminModule,
    HealthModule,
    EmailModule,
    ProfessionalEssenceModule,
  ],
})
export class AppModule {}
