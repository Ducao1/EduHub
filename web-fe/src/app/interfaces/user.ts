import { Role } from "./role";

export interface User {
  id: number;
  phoneNumber: string;
  password: string;
  fullName?: string;
  role: Role;
}