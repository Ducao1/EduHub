export class RegisterDTO {
  full_name: string;
  phone_number: string;
  password: string;

  constructor(data: any) {
    this.full_name = data.fullName;
    this.phone_number = data.phoneNumber;
    this.password = data.password;
  }
}
