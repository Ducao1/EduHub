export class ExamDTO {
    teacher_id!: number;
    title: string;
    duration!: number;

    constructor(data: any) {
        this.title = data.title;
        this.duration = data.duration;
    }
}