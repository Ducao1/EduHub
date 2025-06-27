export class RegisterDTO {
  full_name: string;
  email: string;
  password: string;
  role_id: number;

  constructor(data: any) {
    this.full_name = data.fullName;
    this.email = data.email;
    this.password = data.password;
    this.role_id = data.roleId;
  }
}
