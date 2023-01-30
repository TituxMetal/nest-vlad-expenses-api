import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  amount: string

  @IsDateString()
  @MinLength(24)
  @MaxLength(24)
  @IsNotEmpty()
  date: Date
}
