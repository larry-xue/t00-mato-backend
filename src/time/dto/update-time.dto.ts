import { PartialType } from '@nestjs/swagger';
import { CreateTimeDto } from './create-time.dto';
import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimeDto extends PartialType(CreateTimeDto) {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  readonly todos: number[];
}
