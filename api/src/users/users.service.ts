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
import { UserDto } from './dtos/user-dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async getUserById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  private async checkIfUserWithEmailExists(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async findAllUsers(
    professional?: boolean,
    minAge?: number,
    maxAge?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserDto[]; total: number }> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (professional !== undefined) {
      query.andWhere('user.isProfessional = :professional', { professional });
    }

    if (minAge !== undefined) {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - minAge);
      query.andWhere('user.dateOfBirth <= :minDate', {
        minDate: minDate.toISOString().split('T')[0],
      });
    }

    if (maxAge !== undefined) {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - maxAge);
      query.andWhere('user.dateOfBirth >= :maxDate', {
        maxDate: maxDate.toISOString().split('T')[0],
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await query.getManyAndCount();
    const usersDto = users.map((user) => UserMapper.toDto(user));
    return { users: usersDto, total };
  }

  async findUserById(id: number): Promise<UserDto> {
    const user = await this.getUserById(id);
    return UserMapper.toDto(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    await this.checkIfUserWithEmailExists(createUserDto.email);
    const newUser = this.usersRepository.create(createUserDto);
    return UserMapper.toDto(await this.usersRepository.save(newUser));
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return UserMapper.toDto(await this.usersRepository.save(updatedUser));
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
