import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  end_time: string;

  @OneToMany(() => Todo, (todos) => todos.id)
  todos: number[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
