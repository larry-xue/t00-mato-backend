import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Note } from './entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
