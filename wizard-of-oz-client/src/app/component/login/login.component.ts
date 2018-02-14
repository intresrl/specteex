/*
 * Copyright (C)  2018  Gianni Bombelli & Emanuele Mantovani @ Intré S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';

import {CustomErrorStateMatcher} from '../../service/form.service';
import {DataService} from '../../service/data.service';
import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {User} from '../../../../../wizard-of-oz-common/src/class/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private _webSocket: Subject<MessageEvent>;

  loginForm = new FormGroup({
    nick: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
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
      const formValue = this.loginForm.value;
      const user = User.build(formValue.nick, formValue.email, formValue.isScrumMaster);
      const messageEvent = WebSocketUtils.buildMessageEvent(user, wsPayloadEnum.USER, user);
      this._webSocket.next(messageEvent);
      this.dataService.loginUser(user);
    }
  }

}
