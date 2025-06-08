import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'builder_42', description: 'User handle/username' })
  @IsString()
  @IsOptional()
  handle?: string;

  @ApiProperty({ 
    example: 'OPEN', 
    description: 'User disclosure level', 
    enum: ['OPEN', 'STEALTH']
  })
  @IsEnum(['OPEN', 'STEALTH'])
  @IsOptional()
  disclosureLevel?: 'OPEN' | 'STEALTH';

  @ApiProperty({ 
    example: 'APPROVED', 
    description: 'User status', 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE']
  })
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'])
  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
}
