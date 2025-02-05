import { UsersService } from '../../src/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../../src/auth/dtos/sign-in.dto';
import { SignUpDto } from '../../src/auth/dtos/sign-up.dto';
import { User } from '../../src/users/user.entity';
import { Role } from '../../src/users/role.enum';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../../src/users/dtos/user-dto';
import { Product } from '../../src/products/product.entity';
import { SignInResponseDto } from '../../src/auth/dtos/sign-in-response.dto';
import { mockUsersService } from '../users/users.service.mock';
import { mockJwtService } from './jwt.service.mock';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const signInDto: SignInDto = {
    email: 'kacper@gmail.com',
    password: 'password123',
  };

  const signUpDto: SignUpDto = {
    email: 'kacper@gmail.com',
    name: 'Kacper',
    password: 'password',
    surname: 'Stępień',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
  };

  const userDto: UserDto = {
    id: 1,
    email: 'kacper@gmail.com',
    name: 'Kacper',
    surname: 'Stępień',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
    role: Role.USER,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const signInResponseDto: SignInResponseDto = {
    token: 'token',
    user: userDto,
  };

  const user: User = {
    ...signUpDto,
    id: 1,
    role: Role.USER,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    products: [] as Product[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token and user data', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.signIn(signInDto);

      expect(result).toEqual(signInResponseDto);
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.email,
      });
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
    });

    it("should throw an UnauthorizedException if password doesn't match", async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
    });
  });

  describe('signUp', () => {
    it('should return a user without password', async () => {
      jest.spyOn(usersService, 'createUser').mockResolvedValue(userDto);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');
      const result = await service.signUp(signUpDto);

      expect(result).toEqual(userDto);
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashedPassword123',
      });
    });

    it('should throw a ConflictException if user with given email already exists', async () => {
      const error = new ConflictException(
        'User with this email already exists',
      );
      jest.spyOn(usersService, 'createUser').mockRejectedValue(error);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: expect.any(String),
      });
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      expect(hashedPassword).toEqual('hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
    });

    it('should throw an error if bcrypt fails', async () => {
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('bcrypt error'));

      await expect(bcrypt.hash(signUpDto.password, 10)).rejects.toThrow(
        'bcrypt error',
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      const token = 'mock_token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await jwtService.signAsync({
        sub: user.id,
        username: user.email,
      });

      expect(result).toBe(token);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.email,
      });
    });

    it('should throw an error if JWT signing fails', async () => {
      jest
        .spyOn(jwtService, 'signAsync')
        .mockRejectedValue(new Error('JWT error'));

      await expect(
        jwtService.signAsync({ sub: user.id, username: user.email }),
      ).rejects.toThrow('JWT error');
    });
  });
});
