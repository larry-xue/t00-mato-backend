import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly content: string;
}
