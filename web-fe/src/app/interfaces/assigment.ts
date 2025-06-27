import { Attachment } from "./attachment";
import { Classroom } from "./classroom";
import { User } from "./user";

export interface Assignment {
  id: number;
  title: string;
  content: string;
  classId: number;
  teacherId: number;
  assignedDate?: string;
  dueDate?: string;
  attachments?: Attachment[];
}
