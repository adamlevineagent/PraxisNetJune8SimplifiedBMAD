import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}
