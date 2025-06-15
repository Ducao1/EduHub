import { ExamStatusType } from "../dtos/enums/exam-status-type.enum";

export interface StudentExamStatus {
    studentId: number;
    studentName: string;
    phoneNumber: string;
    status: ExamStatusType;
    startTime: number | null;
    submitTime: number | null;
} 