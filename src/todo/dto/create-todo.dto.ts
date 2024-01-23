import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { RepeatType } from '../types';

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly detail: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Min(1)
  readonly repeat: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly connect_to: number;

  @IsNumber()
  @ApiProperty()
  @Min(1) 
  readonly focus_time: number;

  @IsNumber()
  @ApiProperty()
  @Min(1) 
  readonly rest_time: number;

  @IsString()
  @ApiProperty()
  readonly repeat_type: RepeatType;

  @IsString()
  @ApiProperty()
  readonly repeat_date: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly todo_group_id: number;
}
