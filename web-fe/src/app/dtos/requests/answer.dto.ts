export class AnswerDTO {
    answer_text: string;
    is_correct: boolean;
    question_id!: number;

    constructor(data: any) {
        this.answer_text = data.answer_text;
        this.is_correct = data.is_correct;
        this.question_id = data.question_id;
    }
}
