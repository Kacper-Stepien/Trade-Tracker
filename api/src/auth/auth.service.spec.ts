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

  const user: User = {
    id: 1,
    ...signUpDto,
    role: Role.USER,
    password: 'hashedPassword123',
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

      expect(result).toEqual({
        accessToken: 'token',
        user: {
          ...user,
          password: undefined,
        },
      });
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
      try {
        await service.signIn(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Invalid credentials');
      }
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
    });

    it("should throw an UnauthorizedException if password doesn't match", async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      try {
        await service.signIn(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Invalid credentials');
      }
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
      jest.spyOn(usersService, 'createUser').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        ...user,
        password: undefined,
      });
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

      try {
        await service.signUp(signUpDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User with this email already exists');
      }
    });
  });
});
