export class Statistic {
    id?: String;
    measure?: String;
    value?: Number;
    notes?: String;

    constructor() {
        this.id = '';
        this.measure = '';
        this.value = 0;
        this.notes = '';
    }
}
