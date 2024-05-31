import { Role } from '../role.enum';

export class UserDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  dateOfBirth: Date;
  isProfessional: boolean;
  role: Role;
}
