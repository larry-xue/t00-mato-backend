import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null; // Handle appropriately (e.g., throw NotFoundException)
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
