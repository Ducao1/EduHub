import { Role } from "./role";

export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  description?: string;
  gender?: boolean;
  dob?: string;
  avatar?: string;
  password: string;
  role: Role;
}