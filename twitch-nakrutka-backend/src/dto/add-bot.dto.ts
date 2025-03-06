import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class AddBotDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  display_name: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
