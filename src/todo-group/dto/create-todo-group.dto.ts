import { IsString } from 'class-validator';

export class CreateTodoGroupDto {
  @IsString()
  title: string;
}
