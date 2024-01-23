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
import { Time } from 'src/time/entities/time.entity';

@Injectable()
export class TodoGroupService {
  constructor(
    @InjectRepository(TodoGroup)
    private todoGroupRepository: Repository<TodoGroup>,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private readonly connection: DataSource,
  ) {}
  create(createTodoGroupDto: CreateTodoGroupDto) {
    return this.todoGroupRepository.save(createTodoGroupDto);
  }

  findAll() {
    return this.todoGroupRepository.find();
  }

  findOne(id: number) {
    return this.todoGroupRepository.findOne({
      where: { id },
      relations: ['todos'],
    });
  }

  async update(id: number, updateTodoGroupDto: UpdateTodoGroupDto) {
    const todoGroup = await this.findOne(id);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }
    await this.todoGroupRepository.update(id, {
      ...todoGroup,
      ...updateTodoGroupDto,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const todoGroup = await this.findOne(id);
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

  async connect(connectTodoGroupDto: ConnectTodoGroupDto) {
    const todoGroup = await this.findOne(connectTodoGroupDto.todo_group_id);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }
    const todo = await this.todoRepository.findOne({
      where: { id: connectTodoGroupDto.todo_id },
    });
    if (!todo) {
      throw new NotFoundException('todo not found');
    }

    console.log('todoGroup = ', todoGroup);
    if (todoGroup.todos?.includes(todo.id)) {
      throw new BadRequestException('todo already connected');
    }

    todo.todo_group = todoGroup.id;
    await this.todoRepository.save(todo);

    return this.findOne(todoGroup.id);
  }
}
