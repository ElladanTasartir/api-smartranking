import { IsOptional, IsPhoneNumber } from 'class-validator';

export class EditPlayerDTO {
  @IsOptional()
  @IsPhoneNumber('BR')
  phoneNumber: string;

  @IsOptional()
  name: string;
}
