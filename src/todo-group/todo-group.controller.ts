import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TodoGroupService } from './todo-group.service';
import { CreateTodoGroupDto } from './dto/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dto/update-todo-group.dto';
import { ConnectTodoGroupDto } from './dto/connect-todo-group.dto';
import { Request } from 'express';

@Controller('todo-group')
export class TodoGroupController {
  constructor(private readonly todoGroupService: TodoGroupService) {}

  @Post()
  create(@Body() createTodoGroupDto: CreateTodoGroupDto, @Req() req: Request) {
    return this.todoGroupService.create(createTodoGroupDto, req.user);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.todoGroupService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: Request) {
    return this.todoGroupService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTodoGroupDto: UpdateTodoGroupDto,
    @Req() req: Request
  ) {
    return this.todoGroupService.update(id, updateTodoGroupDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.todoGroupService.remove(id, req.user);
  }

  @Post('connect')
  connect(@Body() connectTodoGroupDto: ConnectTodoGroupDto, @Req() req: Request) {
    return this.todoGroupService.connect(connectTodoGroupDto, req.user);
  }
}
