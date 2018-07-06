export class Directorate {
    _id?: string;
    directorateName: string;
    thePersonInCharge: {
        firstName: string,
        lastName: string
    };
    directorateIsActive: boolean;
    constructor() {
        this._id = '';
        this.directorateName = '';
        this.thePersonInCharge = {
            firstName: '',
            lastName: ''
        };
        this.directorateIsActive = true;
    }
}
