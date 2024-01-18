import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.todoService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todoService.remove(id);
  }

  @Post('repeat')
  updateRepeat(@Body() updateRepeatDto: UpdateRepeatDto) {
    return this.todoService.updateRepeat(updateRepeatDto);
  }
}
