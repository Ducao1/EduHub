import { Submission } from "./submission";
import { User } from "./user";

export interface Score {
  id: number;
  score: number;
  gradedBy?: User;
  submission?: Submission;
}

export interface ScoreAssignmentResponse {
  scoreId: number;
  score: number;
  studentId: number;
  studentName: string;
  studentPhoneNumber: string;
  studentEmail: string;
}

export interface ScoreExamResponse {
  id: number;
  studentName: string;
  total_score: number;
  submittedAt: Date;
}