export class LoginDTO {
    phone_number: string;
    password: string;

    constructor(data: any) {
        this.phone_number = data.phoneNumber;
        this.password = data.password;
    }
}