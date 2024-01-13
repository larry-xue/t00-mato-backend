import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Time } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import dayjs from 'dayjs';
import { formatTime } from 'src/utils/time';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
  ) {}

  async findAll(): Promise<Time[]> {
    return this.timeRepository.find();
  }

  async create(createTimeDto: CreateTimeDto): Promise<Time> {
    const time = this.timeRepository.create({
      ...createTimeDto,
      end_time: formatTime(createTimeDto.end_time),
    });
    return this.timeRepository.save(time);
  }

  async findOne(id: string): Promise<Time> {
    const time = await this.timeRepository.findOne({ where: { id } });
    if (!time) {
      throw new NotFoundException('Time not found');
    }
    return time;
  }

  async update(id: string, updateTimeDto: UpdateTimeDto): Promise<Time> {
    await this.findOne(id); // Ensure the Time exists
    await this.timeRepository.update(id, {
      ...updateTimeDto,
      end_time: formatTime(updateTimeDto.end_time),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const time = await this.findOne(id);
    await this.timeRepository.remove(time);
  }
}
