export class User {
  _id ?: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  role: string;
  directorateName ?: string;
  isInCharge: boolean;
  isActive: boolean;
  constructor() {
    this._id = '';
    this.firstName = '';
    this.lastName = '';
    this.gender = 'male';
    this.email = '';
    this.password = '';
    this.role = 'admin';
    this.directorateName = '';
    this.isInCharge = false;
    this.isActive = true;
  }
}
