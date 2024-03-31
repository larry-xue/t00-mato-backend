import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/todo/entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(@InjectRepository(Todo)
  private readonly todoRepository: Repository<Todo>) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    //  get all loop todos
    const todos = await this.todoRepository.find({
      where: {
        repeat_type: 'loop',
      }
    })

    todos.length && todos.forEach(todo => {
      todo.today_fail_repeat = 0;
      todo.today_success_repeat = 0;
      todo.today_total_time = 0;
    })

    await this.todoRepository.save(todos);
  }
}