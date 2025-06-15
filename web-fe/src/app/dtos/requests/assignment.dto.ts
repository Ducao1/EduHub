export class AssignmentDTO {
    assigned_date!: Date;
    due_date!: Date;
    class_id!: number;
    teacher_id!: number;
    title: string;
    content: string;

    constructor(data: any) {
        this.title = data.title;
        this.content = data.content;
    }
}