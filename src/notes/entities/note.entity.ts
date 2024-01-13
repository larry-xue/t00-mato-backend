import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  update_at: Date;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;
}
