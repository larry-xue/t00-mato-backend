import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  findAll() {
    return this.noteRepository.find();
  }

  findOne(id: number) {
    return this.noteRepository.findOne({
      where: { id },
    });
  }

  create(noteDto: CreateNoteDto) {
    const { title, content } = noteDto;

    const note = this.noteRepository.create({
      title,
      content,
    });

    return this.noteRepository.save(note);
  }

  async update(id: number, noteDto: UpdateNoteDto) {
    const { title, content } = noteDto;

    const note = await this.noteRepository.findOne({
      where: { id },
    });
    if (!note) {
      // Handle error appropriately (e.g., throw NotFoundException)
      return null;
    }

    note.title = title;
    note.content = content;

    return await this.noteRepository.save(note);
  }

  async remove(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id },
    });
    if (!note) {
      // Handle error appropriately (e.g., throw NotFoundException)
      return null;
    }

    return this.noteRepository.remove(note);
  }
}
