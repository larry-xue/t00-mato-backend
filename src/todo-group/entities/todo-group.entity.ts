import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TodoGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  title: string;
}
