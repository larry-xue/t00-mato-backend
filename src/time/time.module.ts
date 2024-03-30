import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeController } from './time.controller';
import { TimeService } from './time.service';
import { Time } from './entities/time.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Time, Todo])],
  controllers: [TimeController],
  providers: [TimeService],
})
export class TimeModule {}
