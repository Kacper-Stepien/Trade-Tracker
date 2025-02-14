import { Role } from "./Role.type";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  dateOfBirth: Date;
  isProfessional: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
