import { Classroom } from "./classroom";
import { User } from "./user";

export interface Assignment {
  id: number;
  title: string;
  content?: string;
  teacher?: User;
  assignedDate: string; // Sử dụng string để ánh xạ LocalDateTime
  dueDate?: string; // Sử dụng string để ánh xạ LocalDateTime
  classroom?: Classroom;
}