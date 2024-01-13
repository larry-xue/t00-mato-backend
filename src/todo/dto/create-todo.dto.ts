import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

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
  @IsString()
  @ApiProperty()
  readonly connect_to: string;
}
