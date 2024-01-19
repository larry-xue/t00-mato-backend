import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @ApiProperty()
  @Min(1)
  @Type(() => Number)
  readonly page: number = 1;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  @Type(() => Number)
  readonly page_size: number = 10;
}
