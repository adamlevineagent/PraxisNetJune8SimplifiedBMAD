import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'techbuilder123', description: 'Username or email address' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'securepassword', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}