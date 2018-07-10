export class Directorate {
<<<<<<< Updated upstream
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
=======
    _id ?: String;
    directorateName: String;
    peopleInChargeEmails: String[];
    directorateIsActive: Boolean;
    constructor() {
        this._id = '';
        this.directorateName = '';
        this.peopleInChargeEmails = [];
>>>>>>> Stashed changes
        this.directorateIsActive = true;
    }
}
