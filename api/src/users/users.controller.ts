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
import { AdminGuard } from '../auth/admin.guard';
import { UserDto } from './dtos/user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private getUserId(req): number {
    return req.user.sub;
  }

  @Get('me')
  getMe(@Request() req): Promise<UserDto> {
    const userId = this.getUserId(req);
    return this.usersService.findUserById(userId);
  }

  @Patch('me')
  updateMe(@Request() req, @Body() body: UpdateUserDto): Promise<UserDto> {
    const userId = this.getUserId(req);
    return this.usersService.updateUser(userId, body);
  }

  @Delete('me')
  deleteMe(@Request() req): Promise<void> {
    const userId = this.getUserId(req);
    return this.usersService.deleteUser(userId);
  }

  @Get()
  // @UseGuards(AdminGuard)
  getUsers(
    @Query('professional') professional?: boolean,
    @Query('minAge') minAge?: number,
    @Query('maxAge') maxAge?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: UserDto[]; total: number }> {
    return this.usersService.findAllUsers(
      professional,
      minAge,
      maxAge,
      page,
      limit,
    );
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  getUser(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.findUserById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
