import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from './role.enum';
import { UserDto } from './dtos/user-dto';
import { UserMapper } from './user.mapper';
import { CreateUserDto } from './dtos/create-user.dto';

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

const mockUsersDto: UserDto[] = mockUsers.map((user) => UserMapper.toDto(user));

describe('UsersService', () => {
  let service: UsersService;

  const createQueryBuilder: any = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockUsers, mockUsers.length]),
  };

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => createQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users and total count', async () => {
      const users = mockUsersDto;
      const total = users.length;

      const result = await service.findAllUsers();
      expect(result).toEqual({ users, total });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should filter users by professional status', async () => {
      const users = mockUsersDto.filter((user) => user.isProfessional);
      const total = users.length;
      createQueryBuilder.getManyAndCount.mockResolvedValue([users, total]);

      const result = await service.findAllUsers(true);
      expect(result).toEqual({ users, total });
      expect(createQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.isProfessional = :professional',
        { professional: true },
      );
    });

    it('should filter users by age range', async () => {
      const minAge = 20;
      const maxAge = 30;
      const users = mockUsersDto.filter(
        (user) =>
          user.dateOfBirth.getFullYear() >= new Date().getFullYear() - maxAge &&
          user.dateOfBirth.getFullYear() <= new Date().getFullYear() - minAge,
      );
      const total = users.length;
      createQueryBuilder.getManyAndCount.mockResolvedValue([users, total]);

      const result = await service.findAllUsers(undefined, minAge, maxAge);
      expect(result).toEqual({ users, total });
      expect(createQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.dateOfBirth <= :minDate',
        expect.any(Object),
      );
      expect(createQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.dateOfBirth >= :maxDate',
        expect.any(Object),
      );
    });

    it('should paginate users', async () => {
      const page = 2;
      const limit = 1;
      const users = mockUsersDto.slice(1, 2);
      const total = mockUsersDto.length;
      createQueryBuilder.getManyAndCount.mockResolvedValue([users, total]);

      const result = await service.findAllUsers(
        undefined,
        undefined,
        undefined,
        page,
        limit,
      );
      expect(result).toEqual({ users, total });
      expect(createQueryBuilder.skip).toHaveBeenCalledWith((page - 1) * limit);
      expect(createQueryBuilder.take).toHaveBeenCalledWith(limit);
    });
  });

  describe('findUserById', () => {
    it('should return a user with given ID', async () => {
      const user = mockUsersDto[0];
      mockUsersRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findUserById(user.id);
      expect(result).toEqual(user);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.findUserById(id)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: CreateUserDto = {
        name: 'Bob',
        surname: 'Brown',
        email: 'brown@gmail.com',
        password: 'password1234',
        dateOfBirth: new Date('1990-01-01'),
        isProfessional: false,
      };

      const newUser: User = {
        ...user,
        id: 1,
        role: Role.USER,
        products: [],
      };

      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      mockUsersRepository.create.mockReturnValue(newUser);
      mockUsersRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(user);
      expect(result).toEqual(UserMapper.toDto(newUser));
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        email: user.email,
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith(user);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw ConflictException if user with given email already exists', async () => {
      const user: CreateUserDto = {
        name: 'Bob',
        surname: 'Brown',
        email: 'brown@gmail.com',
        password: 'password1234',
        dateOfBirth: new Date('1990-01-01'),
        isProfessional: false,
      };

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      await expect(service.createUser(user)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    it('should update a user with given ID', async () => {
      const user = mockUsers[0];
      const updateUser: UpdateUserDto = { name: 'Johnny' };
      const updatedUser = { ...user, ...updateUser };

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user.id, updateUser);

      expect(result).toEqual(UserMapper.toDto(updatedUser));
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;
      const updateUser: UpdateUserDto = { name: 'Johnny' };

      mockUsersRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.updateUser(id, updateUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user with given ID', async () => {
      const user = mockUsersDto[0];
      mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser(user.id);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(user.id);
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;
      mockUsersRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser(id)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
