export class AddClassDTO {
    name: string;
    description: string;

    constructor(data: any) {
        this.name = data.className;
        this.description = data.description;
    }
}