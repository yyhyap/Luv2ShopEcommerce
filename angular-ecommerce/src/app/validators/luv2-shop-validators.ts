import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validator
    static notOnlyWhiteSpace(control: AbstractControl): ValidationErrors | null
    {
        // check if string only has whitespace
        if((control.value != null) && (control.value.trim().length === 0))
        {
            // invalid, return error object
            // 'notOnlyWhiteSpace' >>> Validation Error Key
            // HTML Template will check for this Error Key
            return { 'notOnlyWhiteSpace': true };
        }
        else
        {
            return null;
        }
    }

}
