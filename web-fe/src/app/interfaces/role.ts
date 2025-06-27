export interface Role {
  id: number;
  name: string;
}

export interface UserRolesDTO {
  email: string;
  currentRole: string;
  allRoles: string[];
}