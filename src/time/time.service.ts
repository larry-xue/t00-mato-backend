import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Time } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { formatTime } from 'src/utils/time';
import { Todo } from 'src/todo/entities/todo.entity';
import { RequestUser } from 'src/types/express-addon';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly connection: DataSource,
  ) { }

  async findAll(user: RequestUser) {
    return this.timeRepository.find({
      where: {
        user: { id: user.userId },
      },
      relations: ['todos'],
    })
  }

  async create(createTimeDto: CreateTimeDto, user: RequestUser): Promise<Time> {
    const time = this.timeRepository.create({
      ...createTimeDto,
      end_time: formatTime(createTimeDto.end_time),
      user: {
        id: user.userId
      },
    });
    return this.timeRepository.save(time);
  }

  async findOne(id: number, user: RequestUser): Promise<Time> {
    const time = await this.timeRepository.findOne({
      where: {
        id,
        user: { id: user.userId }
      },
      relations: ['todos']
    })

    if (!time) {
      throw new NotFoundException('Time not found');
    }

    return time;
  }

  async update(id: number, updateTimeDto: UpdateTimeDto, user: RequestUser): Promise<Time> {
    await this.findOne(id, user); // Ensure the Time exists
    // check all the todo exists
    const todos = await Promise.all(
      updateTimeDto.todos.map(
        (id) => this.todoRepository.findOne({
          where: {
            id,
            user: { id: user.userId }
          },
        }
        )
      )
    );

    if (todos.includes(null)) {
      const idx = todos.indexOf(null);
      throw new NotFoundException(`todo_id ${updateTimeDto.todos[idx]} not found`);
    }

    await Promise.all(
      todos.map((todo) => {
        todo.connect_to = id;
        return todo;
      })).then(
        todos => todos.forEach(
          todo => this.todoRepository.save(todo)
        )
      );

    await this.timeRepository.update(id, {
      title: updateTimeDto.title,
      end_time: formatTime(updateTimeDto.end_time),
    });
    return this.findOne(id, user);
  }

  async remove(id: number, user: RequestUser): Promise<void> {
    const time = await this.findOne(id, user);
    if (!time) {
      throw new NotFoundException('Time not found');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 将 time 关联的所有 todo 的 connect_to 字段置为 null
      await queryRunner.manager.update(Todo, { connect_to: id }, { connect_to: null });
      await queryRunner.manager.delete(Time, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await this.timeRepository.remove(time);
  }
}
