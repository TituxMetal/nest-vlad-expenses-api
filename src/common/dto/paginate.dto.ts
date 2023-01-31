import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Max } from 'class-validator'

export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @Max(20)
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Max(100)
  @Type(() => Number)
  offset = 0
}
