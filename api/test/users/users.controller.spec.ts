import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/user.entity';
import { CreateUserDto } from '../../src/users/dtos/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../../src/users/role.enum';
import { UserDto } from '../../src/users/dtos/user.dto';
import { mockUsers, mockUsersDto } from './users.mock';
import { mockUsersService } from './users.service.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users and number of all users', async () => {
      const users: UserDto[] = mockUsersDto;
      jest
        .spyOn(service, 'findAllUsers')
        .mockResolvedValue({ users, total: users.length });
      const result = await controller.getUsers();
      expect(service.findAllUsers).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        1,
        10,
      );
      expect(result).toEqual({ users, total: users.length });
    });

    it('should return an array of users with professional=true', async () => {
      const users: User[] = mockUsersDto.filter(
        (user) => user.isProfessional,
      ) as User[];
      jest
        .spyOn(service, 'findAllUsers')
        .mockResolvedValue({ users, total: users.length });

      expect(await controller.getUsers(true)).toEqual({
        users,
        total: users.length,
      });
      expect(service.findAllUsers).toHaveBeenCalledWith(
        true,
        undefined,
        undefined,
        1,
        10,
      );
    });

    it('should return an array of users with minAge and maxAge', async () => {
      const minAge = 20;
      const maxAge = 30;
      jest
        .spyOn(service, 'findAllUsers')
        .mockResolvedValue({ users: mockUsersDto, total: mockUsersDto.length });

      expect(await controller.getUsers(undefined, minAge, maxAge)).toEqual({
        users: mockUsersDto,
        total: mockUsersDto.length,
      });
      expect(service.findAllUsers).toHaveBeenCalledWith(
        undefined,
        minAge,
        maxAge,
        1,
        10,
      );
    });

    it('should return an array of users with pagination params', async () => {
      const page = 2;
      const limit = 5;
      const users = mockUsersDto.slice(0, limit);
      jest
        .spyOn(service, 'findAllUsers')
        .mockResolvedValue({ users, total: mockUsersDto.length });

      const result = await controller.getUsers(
        undefined,
        undefined,
        undefined,
        page,
        limit,
      );
      expect(result).toEqual({ users, total: mockUsersDto.length });
      expect(service.findAllUsers).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        page,
        limit,
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = mockUsersDto[0];
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      const result = await controller.getUser(1);
      expect(result).toBe(user);
      expect(service.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const error = new NotFoundException(`User with ID 1 not found`);
      jest.spyOn(service, 'findUserById').mockRejectedValue(error);
      await expect(controller.getUser(1)).rejects.toThrow(NotFoundException);
      expect(service.findUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Kacper',
        surname: 'Stepien',
        email: 'kacper2007x48@gmail.com',
        password: 'password1234',
        dateOfBirth: new Date('2007-07-20'),
        isProfessional: false,
      };
      const user: UserDto = {
        ...createUserDto,
        id: 4,
        role: Role.USER,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };
      jest.spyOn(service, 'createUser').mockResolvedValue(user);
      expect(await controller.createUser(createUserDto)).toBe(user);
    });

    it('should throw ConflictException if user with given email already exists', async () => {
      const user = mockUsers[0];
      const error = new ConflictException(
        'User with this email already exists',
      );
      jest.spyOn(service, 'createUser').mockRejectedValue(error);

      await expect(controller.createUser(mockUsers[0])).rejects.toThrow(
        ConflictException,
      );
      expect(service.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updatedUser: UserDto = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'doe@gmail.com',
        dateOfBirth: new Date('1990-01-01'),
        isProfessional: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        role: Role.USER,
      };
      jest.spyOn(service, 'updateUser').mockResolvedValue(updatedUser);
      expect(await controller.updateUser(1, updatedUser)).toBe(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const error = new NotFoundException(`User with ID 1 not found`);
      jest.spyOn(service, 'updateUser').mockRejectedValue(error);
      await expect(controller.updateUser(1, mockUsers[0])).rejects.toThrow(
        NotFoundException,
      );
      expect(service.updateUser).toHaveBeenCalledWith(1, mockUsers[0]);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue();
      expect(await controller.deleteUser(1)).toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const error = new NotFoundException(`User with ID 1 not found`);
      jest.spyOn(service, 'deleteUser').mockRejectedValue(error);
      await expect(controller.deleteUser(1)).rejects.toThrow(NotFoundException);
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
