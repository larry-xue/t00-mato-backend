import { Time } from 'src/time/entities/time.entity';
import { TodoGroup } from 'src/todo-group/entities/todo-group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  detail: string;

  @Column({ default: 1 })
  repeat: number;

  @Column({ default: 0 })
  fail_repeat: number;

  @Column({ default: 0 })
  success_repeat: number;

  @Column({ default: '' })
  repeat_date: string;

  @Column({ default: 'once' })
  repeat_type: string;

  @Column({ default: 5 })
  rest_time: number;

  @Column({ default: 25 })
  focus_time: number;

  // stand for today's total time
  @Column({ default: 0 })
  total_time: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne(() => Time, (time) => time.id)
  @JoinColumn([{ name: 'time_id', referencedColumnName: 'id' }])
  connect_to: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  // 关联代办集合
  @ManyToOne(() => TodoGroup, (todoGroup) => todoGroup.todos)
  @JoinColumn([{ name: 'todo_group_id', referencedColumnName: 'id' }])
  todo_group: number;
}
