import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {Injectable} from '@angular/core';

/** Error when invalid control is dirty, touched, or submitted. */
@Injectable()
export class CustomErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
