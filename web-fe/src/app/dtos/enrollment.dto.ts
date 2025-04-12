export class EnrollmentDTO {
    class_id!: number;
    phone_number: string;

    constructor(data: any) {
        this.phone_number = data.phoneNumber;
    }
}