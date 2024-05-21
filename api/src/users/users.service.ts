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

@Injectable()
export class UsersService {
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
  ): Promise<{ users: User[]; total: number }> {
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
    return { users, total };
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = Object.assign(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
