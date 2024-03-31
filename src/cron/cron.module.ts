import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "src/todo/entities/todo.entity";
import { CronService } from "./cron.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Todo])
  ],
  providers: [CronService],
})
export class CronModule { }