import { PartialType } from '@nestjs/swagger';
import { CreateTodoGroupDto } from './create-todo-group.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateTodoGroupDto extends PartialType(CreateTodoGroupDto) {
  @IsString({ each: true })
  @IsArray()
  todos: string[];
}
