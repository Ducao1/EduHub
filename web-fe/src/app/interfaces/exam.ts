import { ClassExam } from "./class-exam";
import { Question } from "./question";
import { User } from "./user";

export interface Exam {
  id: number;
  title: string;
  teacher?: User;
  questions?: Question[];
  duration: number;
  classExams?: ClassExam[];
}