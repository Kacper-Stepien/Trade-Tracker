import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  getUsers(
    @Query('professional') professional?: boolean,
    @Query('minAge') minAge?: number,
    @Query('maxAge') maxAge?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    return this.usersService.findAllUsers(
      professional,
      minAge,
      maxAge,
      page,
      limit,
    );
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get('me')
  getMe(@Request() req): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.findUserById(userId);
  }

  @Patch('me')
  updateMe(@Request() req, @Body() body: UpdateUserDto): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.updateUser(userId, body);
  }

  @Delete('me')
  deleteMe(@Request() req): Promise<void> {
    const userId = req.user.sub;
    return this.usersService.deleteUser(userId);
  }
}
