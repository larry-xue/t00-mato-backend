import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllDiaries() {
    return this.notesService.findAll();
  }

  @Get(':id')
  getNotesById(@Param('id') id: number) {
    return this.notesService.findOne(id);
  }

  @Post()
  createNotes(@Body() NotesDto: CreateNoteDto) {
    return this.notesService.create(NotesDto);
  }

  @Put(':id')
  updateNotes(@Param('id') id: number, @Body() NotesDto: UpdateNoteDto) {
    return this.notesService.update(id, NotesDto);
  }

  @Delete(':id')
  deleteNotes(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}
