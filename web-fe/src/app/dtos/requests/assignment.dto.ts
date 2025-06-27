export class AssignmentDTO {
    assignedDate!: Date;
    dueDate!: Date;
    classId!: number;
    teacherId!: number;
    title: string;
    content: string;

    constructor(data: any) {
        this.title = data.title;
        this.content = data.content;
    }
}