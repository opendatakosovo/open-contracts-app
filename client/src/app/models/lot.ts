export class Lot {
    id?: String;
    description?: String;
    value?: {
        amount?: Number,
        currency?: String
    };

    constructor() {
        this.id = '';
        this.description = '';
        this.value = {
            amount: 0,
            currency: 'EUR'
        };
    }

}
