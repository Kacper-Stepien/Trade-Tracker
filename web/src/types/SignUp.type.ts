import { Dayjs } from "dayjs";

export interface SignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
  dateOfBirth: Dayjs | null;
  isProfessional: boolean;
}
