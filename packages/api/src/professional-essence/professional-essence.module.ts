import { Module } from '@nestjs/common';
import { ProfessionalEssenceController } from './professional-essence.controller';
import { ProfessionalEssenceOnboardingController } from './professional-essence-onboarding.controller';
import { ProfessionalEssenceService } from './professional-essence.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ProfessionalEssenceController, ProfessionalEssenceOnboardingController],
  providers: [ProfessionalEssenceService],
  exports: [ProfessionalEssenceService],
})
export class ProfessionalEssenceModule {}