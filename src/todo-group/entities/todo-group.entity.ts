import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TodoGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;
}
