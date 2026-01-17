import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

export class UserMapper {
  static toDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.surname = user.surname;
    userDto.email = user.email;
    userDto.dateOfBirth = user.dateOfBirth;
    userDto.isProfessional = user.isProfessional;
    userDto.role = user.role;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;
    return userDto;
  }
}
