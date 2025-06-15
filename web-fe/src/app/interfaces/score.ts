import { Submission } from "./submission";
import { User } from "./user";

export interface Score {
  id: number;
  score: number;
  gradedBy?: User;
  submission?: Submission;
}