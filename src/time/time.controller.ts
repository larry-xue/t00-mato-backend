import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { TimeService } from './time.service';
import { Time } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { Request } from 'express';

@Controller('/time')
export class TimeController {
  constructor(private readonly timeService: TimeService) { }

  @Get()
  findAll(@Req() req: Request) {
    return this.timeService.findAll(req.user);
  }

  @Post()
  create(@Body() createTimeDto: CreateTimeDto, @Req() req: Request): Promise<Time> {
    return this.timeService.create(createTimeDto, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req: Request): Promise<Time> {
    return this.timeService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTimeDto: UpdateTimeDto,
    @Req() req: Request
  ): Promise<Time> {
    return this.timeService.update(id, updateTimeDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    return this.timeService.remove(id, req.user);
  }
}
