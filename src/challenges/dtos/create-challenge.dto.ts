import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsMongoId()
  challenger: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[];
}
