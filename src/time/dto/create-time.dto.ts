import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateTimeDto {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNumber()
  @ApiProperty()
  readonly end_time: number;
}
