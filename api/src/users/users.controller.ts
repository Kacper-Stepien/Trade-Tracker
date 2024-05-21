import { Controller, Body, Get, Post, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'Get all users';
  }

  @Get(':id')
  getUser() {
    return 'Get one user';
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return body;
  }

  @Patch(':id')
  updateUser(@Body() body: UpdateUserDto) {
    return body;
  }

  @Delete(':id')
  deleteUser() {
    return 'Delete user';
  }
}
