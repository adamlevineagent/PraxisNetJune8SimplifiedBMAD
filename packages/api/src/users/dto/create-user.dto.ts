import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securepassword', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'builder_42', description: 'User handle/username' })
  @IsString()
  @IsNotEmpty()
  handle: string;

  @ApiProperty({ 
    example: 'OPEN', 
    description: 'User disclosure level', 
    enum: ['OPEN', 'STEALTH'],
    default: 'STEALTH'
  })
  @IsEnum(['OPEN', 'STEALTH'])
  @IsOptional()
  disclosureLevel?: 'OPEN' | 'STEALTH' = 'STEALTH';
}
