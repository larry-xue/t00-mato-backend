import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { RequestUser } from 'src/types/express-addon';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  findAll(user: RequestUser) {
    return this.noteRepository.find({
      where: { user: { id: user.userId } },
    });
  }

  async findOne(id: number, user: RequestUser) {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: user.userId } },
    });

    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }

    return note;
  }

  create(noteDto: CreateNoteDto, user: RequestUser) {
    const { title, content } = noteDto;

    const note = this.noteRepository.create({
      title,
      content,
      user: {
        id: user.userId,
      },
    });

    return this.noteRepository.save(note);
  }

  async update(id: number, noteDto: UpdateNoteDto, user: RequestUser) {
    const { title, content } = noteDto;

    const note = await this.findOne(id, user);

    if (title) {
      note.title = title;
    }

    if (typeof content === 'string') {
      note.content = content;
    }

    return await this.noteRepository.save({
      ...note,
      update_at: new Date(),
    });
  }

  async remove(id: number, user: RequestUser) {
    const note = await this.findOne(id, user);

    return this.noteRepository.remove(note);
  }
}
