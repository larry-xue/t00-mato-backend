import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoGroupService } from './todo-group.service';
import { CreateTodoGroupDto } from './dto/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dto/update-todo-group.dto';

@Controller('todo-group')
export class TodoGroupController {
  constructor(private readonly todoGroupService: TodoGroupService) {}

  @Post()
  create(@Body() createTodoGroupDto: CreateTodoGroupDto) {
    return this.todoGroupService.create(createTodoGroupDto);
  }

  @Get()
  findAll() {
    return this.todoGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todoGroupService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTodoGroupDto: UpdateTodoGroupDto,
  ) {
    return this.todoGroupService.update(id, updateTodoGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todoGroupService.remove(id);
  }
}
