import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoGroupDto } from './dto/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dto/update-todo-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { DataSource, Repository } from 'typeorm';
import { ConnectTodoGroupDto } from './dto/connect-todo-group.dto';
import { Todo } from 'src/todo/entities/todo.entity';
import { RequestUser } from 'src/types/express-addon';

@Injectable()
export class TodoGroupService {
  constructor(
    @InjectRepository(TodoGroup)
    private todoGroupRepository: Repository<TodoGroup>,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private readonly connection: DataSource,
  ) { }
  create(createTodoGroupDto: CreateTodoGroupDto, user: RequestUser) {
    const todoGroup = this.todoGroupRepository.create({
      ...createTodoGroupDto,
      user: {
        id: user.userId
      },
    })
    return this.todoGroupRepository.save(todoGroup);
  }

  findAll(user: RequestUser) {
    return this.todoGroupRepository.find();
  }

  findOne(id: number, user: RequestUser) {
    return this.todoGroupRepository.findOne({
      where: { id, user: { id: user.userId } },
      relations: ['todos'],
    });
  }

  async update(id: number, updateTodoGroupDto: UpdateTodoGroupDto, user: RequestUser) {
    const todoGroup = await this.findOne(id, user);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }

    await this.todoGroupRepository.update(id, {
      ...todoGroup,
      ...updateTodoGroupDto,
    });

    return this.findOne(id, user);
  }

  async remove(id: number, user: RequestUser) {
    const todoGroup = await this.findOne(id, user);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 将 todoGroup 关联的所有 todo 的 todo_group 字段置为 null
      await queryRunner.manager.update(
        Todo,
        { todo_group: id },
        { todo_group: null },
      );
      await queryRunner.manager.delete(TodoGroup, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    await this.todoGroupRepository.remove(todoGroup);
  }

  async connect(connectTodoGroupDto: ConnectTodoGroupDto, user: RequestUser) {
    const todoGroup = await this.findOne(connectTodoGroupDto.todo_group_id, user);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }
    const todo = await this.todoRepository.findOne({
      where: { id: connectTodoGroupDto.todo_id, user: { id: user.userId } },
    });
    if (!todo) {
      throw new NotFoundException('todo not found');
    }

    if (connectTodoGroupDto.is_disconnect) {
      if ((todoGroup.todos as any)?.map((todo: Todo) => todo.id).includes(todo.id)) {
        todo.todo_group = null;
        await this.todoRepository.save(todo);
        return {
          message: 'todo disconnected',
        }
      } else {
        throw new BadRequestException('todo not yet connected');
      }
    }

    if (todoGroup.todos?.includes(todo.id)) {
      throw new BadRequestException('todo already connected');
    }

    todo.todo_group = todoGroup.id;
    await this.todoRepository.save(todo);

    return this.findOne(todoGroup.id, user);
  }
}
