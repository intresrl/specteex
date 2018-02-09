import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';

import {CustomErrorStateMatcher} from '../../service/form.service';
import {DataService} from '../../service/data.service';
import {WebSocketService} from '../../service/websocket.service';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/class/ws-message';

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
      const user = WebSocketService.convertToPayload(wsPayloadEnum.User, this.loginForm.value);
      const messageEvent = WebSocketService.buildMessageEvent(wsPayloadEnum.User, user);
      this._webSocket.next(messageEvent);
      this.dataService.loginUser(this.loginForm.value);
    }
  }

}
