import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserMapper } from './user.mapper';
import { GetUsersResponseDto } from './dtos/get-users-response.dto';
import { AccountType } from './account-type.enum';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(
    professional?: boolean,
    minAge?: number,
    maxAge?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetUsersResponseDto> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (professional !== undefined) {
      query.andWhere('user.isProfessional = :professional', { professional });
    }

    if (minAge !== undefined) {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - minAge);
      query.andWhere('user.dateOfBirth <= :minDate', { minDate });
    }

    if (maxAge !== undefined) {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - maxAge);
      query.andWhere('user.dateOfBirth >= :maxDate', { maxDate });
    }

    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await query.getManyAndCount();
    return { users: users.map((user) => UserMapper.toDto(user)), total };
  }

  async findUserById(id: number): Promise<UserDto> {
    const user = await this.getUserById(id);
    return UserMapper.toDto(user);
  }

  async findUserByEmail(
    email: string,
    accountType?: AccountType,
  ): Promise<User | null> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (accountType) {
      query.andWhere('user.accountType = :accountType', { accountType });
    }

    return query.getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    this.logger.info('Creating new user', { email: createUserDto.email });
    await this.checkIfUserWithEmailExists(createUserDto.email);
    const newUser = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(newUser);
    this.logger.info('User created successfully', {
      userId: savedUser.id,
      email: savedUser.email,
    });
    return UserMapper.toDto(savedUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    this.logger.info('Updating user', { userId: id });
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);
    this.logger.info('User updated successfully', { userId: id });
    return UserMapper.toDto(savedUser);
  }

  async deleteUser(id: number): Promise<void> {
    this.logger.info('Deleting user', { userId: id });
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn('User not found for deletion', { userId: id });
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info('User deleted successfully', { userId: id });
  }

  private async getUserById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      this.logger.warn('User with given id not found', { userId });
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      this.logger.warn('User with given email not found', { email });
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  private async checkIfUserWithEmailExists(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      this.logger.warn('Attempted to create user with existing email', {
        email,
      });
      throw new ConflictException('User with this email already exists');
    }
  }
}
