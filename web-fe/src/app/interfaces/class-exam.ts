import { Classroom } from "./classroom";
import { Exam } from "./exam";

export interface ClassExam {
  id: number;
  classroom?: Classroom;
  exam?: Exam;
  assignedDate: string; // Sử dụng string để ánh xạ LocalDateTime
  dueDate?: string; // Sử dụng string để ánh xạ LocalDateTime
}