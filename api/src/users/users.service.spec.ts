import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';

const mockUsers = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'doe@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('1990-01-01'),
    isProfessional: false,
  },
  {
    id: 2,
    name: 'Jane',
    surname: 'Wall',
    email: 'wall@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('1995-01-01'),
    isProfessional: true,
  },
  {
    id: 3,
    name: 'Alice',
    surname: 'Smith',
    email: 'smith@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
  },
];

describe('UsersService', () => {
  let service: UsersService;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<User>;

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
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users and total count', async () => {
      const users = mockUsers;
      const total = users.length;

      const result = await service.findAllUsers();
      expect(result).toEqual({ users, total });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should filter users by professional status', async () => {
      const users = mockUsers.filter((user) => user.isProfessional);
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
      const users = mockUsers;
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
      const users = mockUsers.slice(1, 2);
      const total = mockUsers.length;
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
      const user = mockUsers[0];
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

      try {
        await service.findUserById(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID ${id} not found`);
      }

      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'Bob',
        surname: 'Brown',
        email: 'brown@gmail.com',
        password: 'password1234',
        dateOfBirth: new Date('1990-01-01'),
        isProfessional: false,
      };

      const newUser = { ...user, id: 4 };

      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      mockUsersRepository.create.mockReturnValue(newUser);
      mockUsersRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(user);
      expect(result).toEqual(newUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        email: user.email,
      });
      expect(mockUsersRepository.create).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if user with given email already exists', async () => {
      const user = {
        name: 'Bob',
        surname: 'Brown',
        email: 'brown@gmail.com',
        password: 'password1234',
        dateOfBirth: new Date('1990-01-01'),
        isProfessional: false,
      };

      mockUsersRepository.findOneBy.mockResolvedValue(user);

      try {
        await service.createUser(user);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User with this email already exists');
      }
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

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;
      const updateUser: UpdateUserDto = { name: 'Johnny' };

      mockUsersRepository.findOneBy.mockResolvedValue(undefined);

      try {
        await service.updateUser(id, updateUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID ${id} not found`);
      }
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user with given ID', async () => {
      const user = mockUsers[0];
      mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser(user.id);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(user.id);
    });

    it('should throw NotFoundException if user with given ID does not exist', async () => {
      const id = 999;
      mockUsersRepository.delete.mockResolvedValue({ affected: 0 });

      try {
        await service.deleteUser(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with ID ${id} not found`);
      }
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
