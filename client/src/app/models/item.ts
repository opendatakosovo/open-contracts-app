export class Item {
    id?: String;
    description?: String;
    classification?: {
        scheme?: String,
        id?: String,
        description?: String
    };
    quantity?: Number;

    constructor() {
        this.id = '';
        this.description = '';
        this.classification = {
            scheme: '',
            id: '',
            description: ''
        };
        this.quantity = 0;
    }
}
