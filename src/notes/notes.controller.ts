import { Controller, Get, Param, Post, Body, Delete, Put, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllDiaries(@Req() req: Request) {
    return this.notesService.findAll(req.user);
  }

  @Get(':id')
  getNotesById(@Param('id') id: number, @Req() req: Request) {
    return this.notesService.findOne(id, req.user);
  }

  @Post()
  createNotes(@Body() NotesDto: CreateNoteDto, @Req() req: Request) {
    return this.notesService.create(NotesDto, req.user);
  }

  @Put(':id')
  updateNotes(@Param('id') id: number, @Body() NotesDto: UpdateNoteDto, @Req() req: Request) {
    return this.notesService.update(id, NotesDto, req.user);
  }

  @Delete(':id')
  deleteNotes(@Param('id') id: number, @Req() req: Request) {
    return this.notesService.remove(id, req.user);
  }
}
