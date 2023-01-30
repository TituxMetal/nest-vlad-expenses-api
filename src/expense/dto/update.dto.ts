import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  amount?: string

  @IsDateString()
  @IsOptional()
  date?: Date
}
