import { SignInDto } from './dtos/sign-in.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dtos/user-dto';
import { Role } from '../users/role.enum';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';

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
    password: 'password',
    surname: 'Kaczmarek',
    dateOfBirth: new Date('2000-01-01'),
    isProfessional: false,
  };

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
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
    it('should return the user and access token', async () => {
      const user: UserDto = {
        ...signUpDto,
        id: 1,
        role: Role.USER,
      };
      const result = { accessToken: 'token', user: user };

      jest.spyOn(service, 'signIn').mockResolvedValue(result);
      expect(await controller.signIn(signInDto)).toBe(result);
      expect(service.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should throw UnauthorizedException if the credentials are invalid', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      jest.spyOn(service, 'signIn').mockRejectedValue(error);
      try {
        await controller.signIn(signInDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Invalid credentials');
      }

      expect(service.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('signUp', () => {
    it('should return the user without the password', async () => {
      const user: UserDto = {
        ...signUpDto,
        id: 1,
        role: Role.USER,
      };

      jest.spyOn(service, 'signUp').mockResolvedValue(user);
      expect(await controller.signUp(signUpDto)).toBe(user);
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw ConflictException if the email is already taken', async () => {
      const error = new ConflictException(
        'User with this email already exists',
      );
      jest.spyOn(service, 'signUp').mockRejectedValue(error);
      try {
        await controller.signUp(signUpDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User with this email already exists');
      }
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
