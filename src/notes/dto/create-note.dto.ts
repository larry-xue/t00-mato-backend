import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly content: string;
}
