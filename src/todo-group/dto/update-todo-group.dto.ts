import { PartialType } from '@nestjs/swagger';
import { CreateTodoGroupDto } from './create-todo-group.dto';

export class UpdateTodoGroupDto extends PartialType(CreateTodoGroupDto) {}
