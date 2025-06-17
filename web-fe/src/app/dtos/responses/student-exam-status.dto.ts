import { ExamStatusType } from "../enums/exam-status-type.enum";

export class StudentExamStatusDTO {
    studentId!: number;
    studentName!: string;
    phoneNumber!: string;
    status!: ExamStatusType;
    startTime: Date | null = null;
    submitTime: Date | null = null;

    constructor(data: Partial<StudentExamStatusDTO>) {
        Object.assign(this, data);
    }
} 