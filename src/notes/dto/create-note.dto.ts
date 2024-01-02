import { IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}