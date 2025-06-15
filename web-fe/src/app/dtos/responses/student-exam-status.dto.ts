import { ExamStatusType } from "../enums/exam-status-type.enum";

export class StudentExamStatusDTO {
    studentId!: number;
    studentName!: string;
    phoneNumber!: string;
    status!: ExamStatusType;
    startTime: number | null = null;
    submitTime: number | null = null;

    constructor(data: Partial<StudentExamStatusDTO>) {
        Object.assign(this, data);
    }
} 