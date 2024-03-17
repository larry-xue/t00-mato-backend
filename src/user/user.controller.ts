// src/user/user.controller.ts

import { Controller, Get, Param, Post, Body, Put, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/utils/custom-decorators';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/profile')
  getUserInfo(@Req() request: Request) {
    const user: {
      email: string;
    } = request['user'];
    return this.userService.getUserByEmail(user.email);
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Public()
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser({
      ...createUserDto,
      username: createUserDto.email.split('@')[0],
    });
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
