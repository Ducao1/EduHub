import { Assignment } from "./assigment";
import { Exam } from "./exam";
import { Score } from "./score";
import { SubmissionAnswer } from "./submission-answer";
import { User } from "./user";

export interface Submission {
  id: number;
  submittedAt: string; // Sử dụng string để ánh xạ LocalDateTime
  exam?: Exam;
  assignment?: Assignment;
  student?: User;
  filePath?: string;
  submissionAnswers?: SubmissionAnswer[];
  score?: Score;
}