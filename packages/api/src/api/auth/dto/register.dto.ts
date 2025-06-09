import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Unique username for the account',
    minLength: 3,
    maxLength: 30,
    example: 'techbuilder123'
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  })
  username: string;

  @ApiProperty({
    description: 'Account password',
    minLength: 8,
    example: 'SecurePass123!'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Email address for notifications',
    example: 'user@example.com'
  })
  @IsString()
  email: string;
}