import { Module } from '@nestjs/common';
import { OpenRouterService } from './openrouter/openrouter.service';
import { AiService } from './ai.service';

@Module({
  providers: [OpenRouterService, AiService],
  exports: [AiService],
})
export class AiModule {}
