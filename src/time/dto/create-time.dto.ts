import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateTimeDto {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNumber()
  @ApiProperty()
  readonly end_time: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  readonly connections: string[];
}
