import { SubmissionAnswerDTO } from "./submission-answer.dto";


export class SubmissionExamDTO {
    exam_id!: number;
    student_id!: number;
    answers!: SubmissionAnswerDTO[];

    constructor(data: any) {
        this.exam_id = data.exam_id;
        this.student_id = data.student_id;
        this.answers = data.answers;
    }
}
