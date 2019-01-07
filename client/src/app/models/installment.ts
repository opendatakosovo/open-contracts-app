export class Installment {
    id?: String;
    date?: Date;
    payer?: {
        id?: String,
        name?: String
    };
    payee?: {
        id?: String,
        name?: String;
    };
    value?: {
        amount?: Number
        currency?: String
    };


    constructor() {
        this.id = '';
        this.date = null;
        this.payer = {
            id: '',
            name: ''
        };
        this.payee = {
            id: '',
            name: ''
        };
        this.value = {
            amount: 0,
            currency: 'EUR'
        };
    }
}
