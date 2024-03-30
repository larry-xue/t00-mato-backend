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
import { RequestUser } from 'src/types/express-addon';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
    @InjectRepository(TodoGroup)
    private readonly todoGroupRepository: Repository<TodoGroup>,

  ) { }
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
  private async checkTodoGroupExist(id: number) {
    const todoItem = await this.todoGroupRepository.findOne({
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
      !/^[1-7]+$/.test(repeat_date) &&
      repeat_date.length <= 7
    ) {
      throw new BadRequestException(
        'repeat_date is not valid, it must comtain only number from 1 to 7',
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
    if (!data) return null;
    const { connect_to, todo_group } = data;

    if (Array.isArray(data)) {
      return data.map((item) => {
        return {
          ...item,
          connect_to: item.connect_to ? item.connect_to.id : null,
          todo_group: item.todo_group ? item.todo_group.id : null,
        };
      });
    }
    return {
      ...data,
      connect_to: connect_to ? connect_to.id : null,
      todo_group: todo_group ? todo_group.id : null,
    };
  }

  async create(createTodoDto: CreateTodoDto, user: RequestUser) {
    const { connect_to } = createTodoDto;
    await this.checkConnectTo(connect_to);

    await this.commonValidationForTodo(createTodoDto);

    const todo = this.todoRepository.create({
      ...createTodoDto,
      todo_group: createTodoDto?.todo_group_id || null,
      connect_to: createTodoDto?.connect_to || null,
      user: {
        id: user.userId,
      },
    });
    return this.todoRepository.save(todo);
  }

  async findAll(pagination: PaginationDto, user: RequestUser) {
    const todos = this.destructureJoinTableData(
      await this.todoRepository
        .createQueryBuilder('todo')
        .andWhere('todo.user_id = :userId', { userId: user.userId })
        .skip((pagination.page - 1) * pagination.page_size)
        .take(pagination.page_size)
        .leftJoin('todo.connect_to', 'time')
        .addSelect('time.id')
        .leftJoin('todo.todo_group', 'todo_group')
        .addSelect('todo_group.id')
        .getMany(),
    );

    const list = Object.values(todos);

    return {
      list,
      total: list?.length || 0,
      pagination,
    };
  }

  async findOne(id: number, user: RequestUser): Promise<Todo> {
    return this.destructureJoinTableData(
      await this.todoRepository
        .createQueryBuilder('todo')
        .where('todo.user = :userId', { userId: user.userId })
        .andWhere('todo.id = :id', { id })
        .leftJoin('todo.connect_to', 'time')
        .addSelect('time.id')
        .leftJoin('todo.todo_group', 'todo_group')
        .addSelect('todo_group.id')
        .getOne(),
    );
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: RequestUser) {
    const todoItem = await this.findOne(id, user);
    if (!todoItem) {
      throw new NotFoundException('todo not found');
    }

    const { connect_to } = updateTodoDto;
    const timeItem = await this.checkConnectTo(connect_to);

    const updateInfo: any = {
      ...updateTodoDto,
    };
    delete updateInfo.todo_group_id;

    if (updateTodoDto?.todo_group_id) {
      updateInfo.todo_group = updateTodoDto.todo_group_id;
    }
    if (timeItem) {
      updateInfo.connect_to = timeItem?.id;
    }

    const previousInfo = await this.findOne(id, user);

    await this.commonValidationForTodo(updateTodoDto);
    await this.todoRepository.update(id, {
      ...previousInfo,
      ...updateInfo,
    });

    return this.findOne(id, user);
  }

  async remove(id: number, user: RequestUser) {
    const todoItem = await this.findOne(id, user);
    if (!todoItem) {
      throw new NotFoundException('todo not found');
    }
    await this.todoRepository.remove(todoItem);
  }

  async updateRepeat(updateRepeatDto: UpdateRepeatDto, id: number, user: RequestUser) {
    const todoItem = await this.findOne(id, user);
    if (!todoItem) {
      throw new NotFoundException('todo not found');
    }

    if (updateRepeatDto.type === TodoOperaton.success) {
      if (todoItem.success_repeat + 1 > todoItem.repeat) {
        throw new BadRequestException('success_repeat > repeat');
      }
      todoItem.success_repeat = todoItem.success_repeat + 1;
      todoItem.today_success_repeat = todoItem.today_success_repeat + 1;

      todoItem.total_time += todoItem.focus_time;
      todoItem.today_total_time += todoItem.focus_time;
    } else if (updateRepeatDto.type === TodoOperaton.fail) {
      todoItem.fail_repeat = todoItem.fail_repeat + 1;
      todoItem.today_fail_repeat = todoItem.today_fail_repeat + 1;

      if (todoItem.fail_repeat > todoItem.repeat) {
        throw new BadRequestException('fail_repeat > repeat');
      }
      if (updateRepeatDto.time) {
        // check time should less then focus_time and greater than 0
        if (
          updateRepeatDto.time < todoItem.focus_time &&
          updateRepeatDto.time > 0
        ) {
          todoItem.total_time += updateRepeatDto.time;
          todoItem.today_total_time += updateRepeatDto.time;
        } else {
          throw new BadRequestException(
            'time should less then focus_time and greater than 0',
          );
        }
      }
    }

    await this.todoRepository.save(todoItem);
    return todoItem;
  }
}
