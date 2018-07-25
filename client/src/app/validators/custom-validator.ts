import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { controlNameBinding } from '../../../node_modules/@angular/forms/src/directives/reactive_directives/form_control_name';
export class CustomValidator extends Validators {

    static isZero(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            if (value === 0) {
                return { 'isZero': true };
            } else {
                return null;
            }
        };
    }
}

