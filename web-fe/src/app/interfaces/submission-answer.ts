import { Answer } from "./answer";
import { Question } from "./question";
import { Submission } from "./submission";

export interface SubmissionAnswer {
  id: number;
  answer?: Answer;
  submission?: Submission;
  question?: Question;
}