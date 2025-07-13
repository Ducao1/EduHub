export class EnrollmentDTO {
    class_id!: number;
    email: string;

    constructor(data: any) {
        this.email = data.email;
    }
}