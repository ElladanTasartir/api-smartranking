import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class UpdateChallengeDTO {
  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  status: ChallengeStatus;
}
