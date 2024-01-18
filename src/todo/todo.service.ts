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
import { TodoGroup } from 'src/todo-group/entities/todo-group.entity';
import { RepeatType } from './types';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
    @InjectRepository(TodoGroup)
    private readonly todoGroupRepository: Repository<TodoGroup>,
  ) {}
  private async checkConnectTo(id: number): Promise<Time> {
    let timeItem: Time = null;
    if (id) {
      // judge if connect_to is valid in TimeDatabase
      timeItem = await this.timeRepository.findOne({
        where: { id },
      });
      if (!timeItem) {
        throw new NotFoundException('connect_to is not valid');
      }
    }

    return timeItem;
  }
  private checkTodoGroupExist(id: number) {
    const todoItem = this.todoGroupRepository.findOne({
      where: { id },
    });
    if (!todoItem) {
      throw new NotFoundException('todo group not found');
    }
  }
  private checkRepeat(repeat_type: RepeatType, repeat_date: string) {
    if (repeat_type !== 'loop' && repeat_type !== 'once') {
      throw new BadRequestException(
        'repeat_type is not valid, must be loop or once',
      );
    }

    if (repeat_type === 'once') return;

    if (repeat_type === 'loop' && !repeat_date) {
      throw new BadRequestException(
        'repeat_date is not valid when repeat_type is loop',
      );
    }

    // check repeat_date syntax, it must be '1234567'
    // regexp check repeat_type only contains number
    if (
      repeat_date &&
      !/^[0-7]+$/.test(repeat_date) &&
      repeat_date.length <= 7
    ) {
      throw new BadRequestException(
        'repeat_date is not valid, it must comtain only number from 0 to 7',
      );
    } else {
      const repeatDateArr = repeat_date.split('');
      // check the repeat_date should not contain some characters
      if (repeatDateArr.length !== new Set(repeatDateArr).size) {
        throw new BadRequestException(
          'repeat_date is not valid, it must not contain some characters',
        );
      }
      // check the order of repeat_date is increasing
      for (let i = 0; i < repeatDateArr.length - 1; i++) {
        if (repeatDateArr[i] > repeatDateArr[i + 1]) {
          throw new BadRequestException(
            'repeat_date is not valid, it must be increasing',
          );
        }
      }
    }
  }
  private async commonValidationForTodo(
    todoDto: CreateTodoDto | UpdateTodoDto,
  ) {
    const { todo_group_id, repeat_type, repeat_date } = todoDto;

    // check todo_group_id, if not null, then todo-group row must exist
    if (todo_group_id) {
      await this.checkTodoGroupExist(todo_group_id);
    }

    this.checkRepeat(repeat_type, repeat_date);
  }

  // TODO: fix not use any
  private destructureJoinTableData(data: any) {
    const { connect_to, todo_group } = data;
    return {
      ...data,
      connect_to: connect_to ? connect_to.id : null,
      todo_group: todo_group ? todo_group.id : null,
    };
  }

  async create(createTodoDto: CreateTodoDto) {
    const { connect_to } = createTodoDto;
    const timeItem = await this.checkConnectTo(connect_to);

    await this.commonValidationForTodo(createTodoDto);

    const todo = this.todoRepository.create({
      ...createTodoDto,
      connect_to: timeItem.id,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(pagination: PaginationDto) {
    // TODO: add filter of user_id and connect_id
    const todos = this.destructureJoinTableData(
      await this.todoRepository
        .createQueryBuilder('todo')
        .skip((pagination.page - 1) * pagination.page_size)
        .take(pagination.page_size)
        .leftJoin('todo.connect_to', 'time')
        .addSelect('time.id')
        .leftJoin('todo.todo_group', 'todo_group')
        .addSelect('todo_group.id')
        .getMany(),
    );

    return {
      list: Object.values(todos),
      total: await this.todoRepository.count(),
      pagination,
    };
  }

  async findOne(id: number) {
    return this.destructureJoinTableData(
      await this.todoRepository
        .createQueryBuilder('todo')
        .where('todo.id = :id', { id })
        .leftJoin('todo.connect_to', 'time')
        .addSelect('time.id')
        .leftJoin('todo.todo_group', 'todo_group')
        .addSelect('todo_group.id')
        .getOne(),
    );
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const { connect_to } = updateTodoDto;
    const timeItem = await this.checkConnectTo(connect_to);

    await this.commonValidationForTodo(updateTodoDto);

    await this.todoRepository.update(id, {
      ...updateTodoDto,
      connect_to: timeItem.id,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
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
