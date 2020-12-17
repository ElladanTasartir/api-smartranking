import { IsMongoId, IsOptional } from 'class-validator';

export class FindChallengeByPlayerDTO {
  @IsOptional()
  @IsMongoId()
  _id: string;
}
