import { ExamStatusType } from "../dtos/enums/exam-status-type.enum";
import { Exam } from "./exam";
import { User } from "./user";


export interface ExamStatus {
  exam?: Exam;
  student?: User;
  status: ExamStatusType;
  startTime?: number; // Sử dụng number để ánh xạ Long
  submitTime?: number; // Sử dụng number để ánh xạ Long
}