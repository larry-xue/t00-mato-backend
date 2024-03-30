import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { makeUsername } from 'src/utils';
import { Exclude } from 'class-transformer';
import { Time } from 'src/time/entities/time.entity';
import { TodoGroup } from 'src/todo-group/entities/todo-group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, default: makeUsername(5) })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 0 })
  sex: number;

  @Column({ default: 0 })
  age: number;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  avatar: string;

  @OneToMany(() => Note, note => note.user)
  notes: Note[];

  @OneToMany(() => Time, time => time.user)
  times: Time[];

  @OneToMany(() => TodoGroup, todoGroup => todoGroup.user)
  todoGroups: TodoGroup[];
}