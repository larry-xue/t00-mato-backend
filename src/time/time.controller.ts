import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TimeService } from './time.service';
import { Time } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';

@Controller('/time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get()
  findAll(): Promise<Time[]> {
    return this.timeService.findAll();
  }

  @Post()
  create(@Body() createTimeDto: CreateTimeDto): Promise<Time> {
    return this.timeService.create(createTimeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Time> {
    return this.timeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeDto: UpdateTimeDto,
  ): Promise<Time> {
    return this.timeService.update(id, updateTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.timeService.remove(id);
  }
}
