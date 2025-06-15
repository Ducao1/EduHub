import { ClassExam } from "./class-exam";
import { Exam } from "./exam";
import { User } from "./user";

export interface Classroom {
  id: number;
  name: string;
  description?: string;
  teacher?: User;
  isActive: boolean;
  code?: string;
  classExams?: ClassExam[];
}