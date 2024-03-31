import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/todo/entities/todo.entity';
import { RequestUser } from 'src/types/express-addon';
import { TimeScopeDto } from './dto/time-scope.dto';

@Injectable()
export class StatsService {
  constructor(@InjectRepository(Todo)
  private readonly todoRepository: Repository<Todo>,) { }

  // 配置定时器，零点时更新循环任务的状态
  async getOverview(user: RequestUser): Promise<any> {
    // get today's focus times
    const allTodos = await this.todoRepository
      .createQueryBuilder()
      .select()
      .where({ user: { id: user.userId } })
      .getMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTodos = allTodos.filter(
      todo =>
        todo.create_at >= today ||
        todo.repeat_date.indexOf(today.getDay() + 1 + '') > -1
    );

    // calculate cumulate focus times
    const cumulateFocusTimes = allTodos.reduce((sum, todo) => sum + todo.success_repeat, 0);
    const totalTime = allTodos.reduce((sum, todo) => sum + todo.total_time, 0);
    const todayTotalTime = todayTodos.reduce((sum, todo) => sum + todo.today_total_time, 0);
    const todayFocusTimes = todayTodos.reduce((sum, todo) => sum + todo.today_success_repeat, 0);
    const todayFailedTimes = todayTodos.reduce((sum, todo) => sum + todo.today_fail_repeat, 0);

    return {
      cumulate_focus_times: cumulateFocusTimes,
      total_time: totalTime,
      average_day_time: allTodos.length > 0 ? totalTime / allTodos.length : 0,
      today_focus_times: todayFocusTimes,
      today_total_time: todayTotalTime,
      today_forgive_times: todayFailedTimes,
    };
  }

  async getScopeStats(scope: TimeScopeDto, user: RequestUser) {
    const { start_date, end_date } = scope;
    const allTodos = await this.todoRepository
      .createQueryBuilder()
      .select()
      .where({ user: { id: user.userId } })
      .andWhere('create_at >= :start_date', { start_date: new Date(start_date) })
      .andWhere('create_at <= :end_date', { end_date: new Date(end_date) })
      .getMany();

    // calculate average time
    const totalTime = allTodos.reduce((sum, todo) => sum + todo.total_time, 0);
    const averageTime = allTodos.length ? totalTime / allTodos.length : 0;

    const results = allTodos.map((todo) => ({
      todo_title: todo.title,
      todo_id: todo.id,
      todo_time: todo.total_time,
    }));

    return {
      total_time: totalTime,
      average_time: averageTime,
      results,
    };
  }

  async getHourlyStats(scope: TimeScopeDto, user: RequestUser) {
    const { start_date, end_date } = scope;
    const allTodos = await this.todoRepository
      .createQueryBuilder()
      .select()
      .where({ user: { id: user.userId } })
      .andWhere('create_at >= :start_date', { start_date: new Date(start_date) })
      .andWhere('create_at <= :end_date', { end_date: new Date(end_date) })
      .getMany();

    // init focusMap
    const focusMap: { [key: number]: { times: number; time: number } } = {};
    for (let i = 0; i < 24; i++) {
      focusMap[i] = { times: 0, time: 0 };
    }

    // for each hour, calculate focus times and focus time
    allTodos.forEach((todo) => {
      const hour = todo.update_at.getHours();
      const index = focusMap[hour];
      index.times += 1;
      index.time += todo.total_time;
    });

    // 将统计结果转换为响应格式
    const results = Object.keys(focusMap).map((key) => {
      const data = focusMap[parseInt(key)];
      return {
        clock: parseInt(key),
        times: data.times,
        time: data.time,
      };
    });

    return {
      results,
    };
  }

  async getMonthlyStats(scope: TimeScopeDto, user: RequestUser) {
    const { start_date } = scope;

    const startDate = new Date(start_date);

    const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    // generate days
    const days = [];
    for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day = day + 1) {
      days.push(day);
    }

    // query todos
    const todos = await this.todoRepository
      .createQueryBuilder()
      .select()
      .where({ user: { id: user.userId } })
      .andWhere('create_at >= :start_date', { start_date: firstDayOfMonth })
      .andWhere('create_at <= :end_date', { end_date: lastDayOfMonth })
      .getMany();

    // init timeMap
    const timeMap = new Map();
    todos.forEach((todo) => {
      const date = new Date(todo.create_at);
      const day = date.getDate();
      timeMap.set(day, (timeMap.get(day) || 0) + todo.total_time);
    });

    // generate results
    const results = days.map((day) => {
      const time = timeMap.get(day) || 0;
      return { day, time: time };
    });

    return { results };
  }
}
