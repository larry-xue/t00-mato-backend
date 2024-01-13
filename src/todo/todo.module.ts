import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Time } from 'src/time/entities/time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Time])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
