import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Time {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  end_time: string;

  @Column('simple-array')
  connections: string[];
}
