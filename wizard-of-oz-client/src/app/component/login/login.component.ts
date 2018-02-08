import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';

import {CustomErrorStateMatcher} from '../../service/form.service';
import {DataService} from '../../service/data.service';
import {WebSocketService} from '../../service/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private _webSocket: Subject<MessageEvent>;

  loginForm = new FormGroup({
    nick: new FormControl('a', [
      Validators.required
    ]),
    email: new FormControl('a@a', [
      Validators.required,
      Validators.email,
    ]),
    isScrumMaster: new FormControl(false)
  });

  matcher = new CustomErrorStateMatcher();

  constructor(private dataService: DataService, private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
  }

  public doLogin() {
    if (this.loginForm.valid) {
      this._webSocket.next(WebSocketService.buildWsMessage(this.loginForm.value));
      this.dataService.loginUser(this.loginForm.value);
    }
  }

}
