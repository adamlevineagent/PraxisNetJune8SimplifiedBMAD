import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { AgentsModule } from '../agents/agents.module';
import { ProfessionalEssenceModule } from '../professional-essence/professional-essence.module';

@Module({
  imports: [PrismaModule, AiModule, AgentsModule, ProfessionalEssenceModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
