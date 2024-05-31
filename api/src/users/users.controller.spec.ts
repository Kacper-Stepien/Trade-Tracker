import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from './role.enum';
import { UserDto } from './dtos/user-dto';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'doe@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('1990-01-01'),
    isProfessional: false,
    role: Role.USER,
    products: [],
  },
  {
    id: 2,
    name: 'Jane',
    surname: 'Wall',
    email: 'wall@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('1995-01-01'),
    isProfessional: true,
    role: Role.USER,
    products: [],
  },
  {
    id: 3,
    name: 'Alice',
    surname: 'Smith',
    email: 'smith@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
    role: Role.USER,
    products: [],
  },
];

const mockUsersDto = mockUsers.map((user) => {
  const { password, ...userDto } = user;
  return userDto;
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

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
    it('should return an array of users', async () => {
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

      expect(
        await controller.getUsers(undefined, undefined, undefined, page, limit),
      ).toEqual({ users, total: mockUsersDto.length });
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
      expect(await controller.getUser(1)).toBe(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const error = new NotFoundException(`User with ID 1 not found`);
      jest.spyOn(service, 'findUserById').mockRejectedValue(error);

      try {
        await controller.getUser(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID 1 not found`);
      }

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
      const user = new User();
      jest.spyOn(service, 'createUser').mockResolvedValue(user);
      expect(await controller.createUser(createUserDto)).toBe(user);
    });

    it('should throw ConflictException if user with given email already exists', async () => {
      const user = mockUsers[0];
      const error = new ConflictException(
        'User with this email already exists',
      );
      jest.spyOn(service, 'createUser').mockRejectedValue(error);

      try {
        await controller.createUser(user);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User with this email already exists');
      }

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
        role: Role.USER,
      };
      jest.spyOn(service, 'updateUser').mockResolvedValue(updatedUser);
      expect(await controller.updateUser(1, updatedUser)).toBe(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const error = new NotFoundException(`User with ID 1 not found`);
      jest.spyOn(service, 'updateUser').mockRejectedValue(error);

      try {
        await controller.updateUser(1, mockUsers[0]);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID 1 not found`);
      }

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

      try {
        await controller.deleteUser(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID 1 not found`);
      }

      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
