import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TodoGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @OneToMany(() => Todo, (todos) => todos.todo_group)
  todos: number[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
