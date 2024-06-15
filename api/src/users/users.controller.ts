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
import { GetUsersResponseDto } from './dtos/get-users-response.dto';
import { GetUserNotFoundResponseDto } from './dtos/get-user-not-found-response.dto';
import { CreateUserConflictResponseDto } from './dtos/create-user-conflict-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: "Get current (logged in) user's data" })
  @ApiResponse({
    status: 200,
    description: "Current user's data",
    type: UserDto,
  })
  getMe(@Request() req): Promise<UserDto> {
    const userId = this.getUserId(req);
    return this.usersService.findUserById(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: "Update current (logged in) user's data" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Updated current user's data",
    type: UserDto,
  })
  updateMe(@Request() req, @Body() body: UpdateUserDto): Promise<UserDto> {
    const userId = this.getUserId(req);
    return this.usersService.updateUser(userId, body);
  }

  @Delete('me')
  @ApiOperation({ summary: "Delete current (logged in) user's account" })
  @ApiResponse({ status: 202, description: 'User deleted' })
  deleteMe(@Request() req): Promise<void> {
    const userId = this.getUserId(req);
    return this.usersService.deleteUser(userId);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get list of all users - only for admin' })
  @ApiQuery({ name: 'professional', required: false, type: Boolean })
  @ApiQuery({ name: 'minAge', required: false, type: Number })
  @ApiQuery({ name: 'maxAge', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of users with total count',
    type: GetUsersResponseDto,
  })
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
  @ApiOperation({ summary: 'Get user by id - only for admin' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: GetUserNotFoundResponseDto,
  })
  getUser(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.findUserById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create new user - only for admin' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Created user data',
    type: UserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: CreateUserConflictResponseDto,
  })
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user by id - only for admin' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Updated user data',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: GetUserNotFoundResponseDto,
  })
  updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete user by id - only for admin' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 202, description: 'User deleted' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: GetUserNotFoundResponseDto,
  })
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  private getUserId(req): number {
    return req.user.sub;
  }
}
