import { User } from '../models/user';

export class Directorate {
    _id?: string;
    directorateName: string;
    peopleInCharge: String[];
    directorateIsActive: boolean;
    constructor() {
        this._id = '';
        this.directorateName = '';
        this.peopleInCharge = [];
        this.directorateIsActive = true;
    }
}
