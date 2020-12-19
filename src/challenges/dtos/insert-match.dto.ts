import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.interface';

export class insertMatchDTO {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  result: Result[];
}
