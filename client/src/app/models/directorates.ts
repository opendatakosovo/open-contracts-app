export class Directorate {
    _id ?: string;
    directorateName: string;
    thePersonInChargeEmail: string;
    directorateIsActive: boolean;
    constructor() {
        this._id = '';
        this.directorateName = '';
        this.thePersonInChargeEmail = '';
        this.directorateIsActive = true;
    }
}
