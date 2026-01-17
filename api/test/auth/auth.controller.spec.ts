import { SignInDto } from '../../src/auth/dtos/sign-in.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../../src/users/dtos/user.dto';
import { Role } from '../../src/users/role.enum';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../../src/auth/dtos/sign-up.dto';
import { SignInResponseDto } from '../../src/auth/dtos/sign-in-response.dto';
import { mockAuthService } from './auth.service.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const signInDto: SignInDto = {
    email: 'kacper@gmail.com',
    password: 'password123',
  };

  const signUpDto: SignUpDto = {
    email: 'kacper@gmail.com',
    name: 'Kacper',
    password: 'password123',
    surname: 'Kaczmarek',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
  };

  const userDto: UserDto = {
    ...signUpDto,
    id: 1,
    role: Role.USER,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const signInResponseDto: SignInResponseDto = {
    token: 'token',
    user: userDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token and user details when credentials are valid', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue(signInResponseDto);
      const result = await controller.signIn(signInDto);
      expect(result).toEqual(signInResponseDto);
      expect(service.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should throw UnauthorizedException if the credentials are invalid', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      jest.spyOn(service, 'signIn').mockRejectedValue(error);
      await expect(controller.signIn(signInDto)).rejects.toThrow(error);
      expect(service.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('signUp', () => {
    it('should return the user without the password', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue(userDto);
      const result = await controller.signUp(signUpDto);
      expect(result).toEqual(userDto);
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw ConflictException if the email is already taken', async () => {
      const error = new ConflictException(
        'User with this email already exists',
      );
      jest.spyOn(service, 'signUp').mockRejectedValue(error);
      await expect(controller.signUp(signUpDto)).rejects.toThrow(error);
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
