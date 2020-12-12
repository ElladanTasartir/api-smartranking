import { IsEmail } from 'class-validator';

export class FindParamDTO {
  @IsEmail()
  email: string;
}
