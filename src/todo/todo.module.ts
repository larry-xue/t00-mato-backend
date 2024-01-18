import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Time } from 'src/time/entities/time.entity';
import { TodoGroup } from 'src/todo-group/entities/todo-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Time, TodoGroup])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
