import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';
import { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    return this.todoService.create(createTodoDto, req.user);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto, @Req() req: Request) {
    return this.todoService.findAll(pagination, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: Request) {
    return this.todoService.findOne(id, req.user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Req() req: Request) {
    return this.todoService.update(id, updateTodoDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.todoService.remove(id, req.user);
  }

  @Post('repeat/:id')
  updateRepeat(@Param('id') id: number, @Body() updateRepeatDto: UpdateRepeatDto, @Req() req: Request) {
    return this.todoService.updateRepeat(updateRepeatDto, id, req.user);
  }
}
