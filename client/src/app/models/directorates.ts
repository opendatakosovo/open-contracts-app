export class Directorate {
    _id ?: string;
    directorateName: string;
    thePersonInChargeEmail: string;
    isActive: boolean;
    constructor() {
        this._id = '';
        this.directorateName = '';
        this.thePersonInChargeEmail = '';
        this.isActive = true;
    }
}
