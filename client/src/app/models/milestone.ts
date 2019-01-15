export class Milestone {
    id?: String;
    title?: String;
    type?: String;
    code?: String;
    dateMet?: Date;
    status?: String;

    constructor() {
        this.id = '';
        this.title = '';
        this.type = '';
        this.code = '';
        this.dateMet = null;
        this.status = '';
    }
}
