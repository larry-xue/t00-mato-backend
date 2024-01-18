import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoGroupDto } from './dto/create-todo-group.dto';
import { UpdateTodoGroupDto } from './dto/update-todo-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoGroupService {
  constructor(
    @InjectRepository(TodoGroup)
    private todoGroupRepository: Repository<TodoGroup>,
  ) {}
  create(createTodoGroupDto: CreateTodoGroupDto) {
    return this.todoGroupRepository.save(createTodoGroupDto);
  }

  findAll() {
    return this.todoGroupRepository.find();
  }

  findOne(id: string) {
    return this.todoGroupRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTodoGroupDto: UpdateTodoGroupDto) {
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

  async remove(id: string) {
    const todoGroup = await this.findOne(id);
    if (!todoGroup) {
      throw new NotFoundException('todoGroup not found');
    }
    await this.todoGroupRepository.remove(todoGroup);
  }
}
