import { UsersService } from './../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { User } from '../users/user.entity';
import { Role } from '../users/role.enum';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/user-dto';
import { Product } from '../products/product.enity';
import { SignInResponseDto } from './dtos/sign-in-response.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

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
  };

  const signInResponseDto: SignInResponseDto = {
    token: 'token',
    user: userDto,
  };

  const user: User = {
    ...signUpDto,
    id: 1,
    role: Role.USER,
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
});
