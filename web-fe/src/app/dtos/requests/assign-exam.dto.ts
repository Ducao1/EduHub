export class AssignExamDTO {
    assigned_date!: Date;
    due_date!: Date;
    class_id!: number;
    exam_id!: number;

    constructor(data: any) {
        this.class_id = data.class_id;
        this.exam_id = data.exam_id;
        this.assigned_date = data.assignedDate;
        this.due_date = data.dueDate;
    }
}