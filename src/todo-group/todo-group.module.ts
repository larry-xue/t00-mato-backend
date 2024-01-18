import { Module } from '@nestjs/common';
import { TodoGroupService } from './todo-group.service';
import { TodoGroupController } from './todo-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoGroup } from './entities/todo-group.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoGroup, Todo])],
  controllers: [TodoGroupController],
  providers: [TodoGroupService],
})
export class TodoGroupModule {}
