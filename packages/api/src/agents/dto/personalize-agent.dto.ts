import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CommunicationStyle {
  PROFESSIONAL = 'PROFESSIONAL',
  CONVERSATIONAL = 'CONVERSATIONAL',
  DIRECT = 'DIRECT',
}

export class PersonalizeAgentDto {
  @ApiProperty({
    description: 'Name for the AI agent',
    minLength: 2,
    maxLength: 50,
    example: 'Alex'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  agentName: string;

  @ApiProperty({
    description: 'Communication style for the agent',
    enum: CommunicationStyle,
    example: CommunicationStyle.CONVERSATIONAL
  })
  @IsEnum(CommunicationStyle)
  communicationStyle: CommunicationStyle;
}