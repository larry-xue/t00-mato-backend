import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { Time } from 'src/time/entities/time.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateRepeatDto } from './dto/update-repeat.dto';
import { TodoOperaton } from 'src/common/constants/todo.constant';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
  ) {}
  private checkConnectTo(id: string): Time | null {
    let timeItem = null;
    if (id) {
      // judge if connect_to is valid in TimeDatabase
      timeItem = this.timeRepository.findOne({
        where: { id },
      });
      if (!timeItem) {
        throw new NotFoundException('connect_to is not valid');
      }
    }

    return timeItem;
  }
  create(createTodoDto: CreateTodoDto) {
    const { connect_to } = createTodoDto;
    const timeItem = this.checkConnectTo(connect_to);

    const todo = this.todoRepository.create({
      ...createTodoDto,
      connect_to: timeItem,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(pagination: PaginationDto) {
    // TODO: add filter of user_id and connect_id
    const todos = await this.todoRepository.find({
      take: pagination.page_size,
      skip: (pagination.page - 1) * pagination.page_size,
    });

    return {
      list: todos,
      total: await this.todoRepository.count(),
      pagination,
    };
  }

  findOne(id: string) {
    return this.todoRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { connect_to } = updateTodoDto;
    const timeItem = this.checkConnectTo(connect_to);

    await this.todoRepository.update(id, {
      ...updateTodoDto,
      connect_to: timeItem,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const todoItem = await this.findOne(id);
    if (!todoItem) {
      throw new NotFoundException('todo not found');
    }
    await this.todoRepository.remove(todoItem);
  }

  async updateRepeat(updateRepeatDto: UpdateRepeatDto) {
    // TODO: fix uuid validation excepion
    const todoItem = await this.findOne(updateRepeatDto.id);
    if (!todoItem) {
      throw new NotFoundException('todo not found');
    }

    if (updateRepeatDto.operation === TodoOperaton.done) {
      todoItem.success_repeat = todoItem.success_repeat + 1;
    } else if (updateRepeatDto.operation === TodoOperaton.fail) {
      todoItem.fail_repeat = todoItem.fail_repeat + 1;
      if (todoItem.fail_repeat > todoItem.repeat) {
        throw new BadRequestException('fail_repeat > repeat');
      }
    }

    await this.todoRepository.save(todoItem);
    return todoItem;
  }
}
