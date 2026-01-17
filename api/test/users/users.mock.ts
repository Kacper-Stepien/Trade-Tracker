import { User } from '../../src/users/user.entity';
import { UserDto } from '../../src/users/dtos/user.dto';
import { UserMapper } from '../../src/users/user.mapper';
import { Role } from '../../src/users/role.enum';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'doe@gmail.com',
    password: 'password1234',
    dateOfBirth: new Date('1990-01-01'),
    isProfessional: false,
    role: Role.USER,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
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
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
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
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    products: [],
  },
];

export const mockUsersDto: UserDto[] = mockUsers.map((user) =>
  UserMapper.toDto(user),
);
