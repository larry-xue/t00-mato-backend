import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateTimeDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly start_time: number;
  
  @IsArray()
  @IsString({ each: true })
  readonly connections: string[];
}
