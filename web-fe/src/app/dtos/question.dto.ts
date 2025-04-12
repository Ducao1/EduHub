import { AnswerDTO } from "./answer.dto";

export class QuestionDTO {
    question_text!: string;
    type!: string;
    exam_id!: number;
    answers!: AnswerDTO[];
    point?: number;
}