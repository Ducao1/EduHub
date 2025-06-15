import { Question } from "./question";

export interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
  question?: Question;
}