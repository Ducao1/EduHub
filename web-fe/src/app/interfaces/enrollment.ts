import { Classroom } from "./classroom";
import { User } from "./user";

export interface Enrollment {
  id: number;
  classroom?: Classroom;
  student?: User;
}