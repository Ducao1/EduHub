import { Answer } from "./answer";
import { Exam } from "./exam";

export interface Question {
  id: number;
  questionText: string;
  type: QuestionType;
  exam?: Exam;
  point: number;
  answers?: Answer[];
  examId?: number;
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE'
}