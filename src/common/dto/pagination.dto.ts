import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @ApiProperty()
  @Min(1)
  readonly page: number = 1;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  @Max(100)
  readonly page_size: number = 10;
}
