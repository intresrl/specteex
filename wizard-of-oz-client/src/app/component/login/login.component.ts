import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {CustomErrorStateMatcher} from '../../service/form.service';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    nick: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    isScrumMaster: new FormControl('')
  });

  matcher = new CustomErrorStateMatcher();

  constructor(private dataService: DataService) { }

  public doLogin() {
    if (this.loginForm.valid) {
      this.dataService.loginUser(this.loginForm.value);
    }
  }

}
