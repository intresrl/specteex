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

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

import {userUiConfigs} from '../../../../wizard-of-oz-common/src/config/users-ui-config';

import {UiConfig} from '../../../../wizard-of-oz-common/src/interface/ui-config';
import {User} from '../../../../wizard-of-oz-common/src/interface/user';
import {WebSocketService} from './websocket.service';
import {WsPayloadEnum} from '../../../../wizard-of-oz-common/src/enum/ws-payload.enum';

@Injectable()
export class DataService {
  private _webSocket: Subject<MessageEvent>;

  private _currentUserChangeEvent: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public readonly currentUserChangeEvent = this._currentUserChangeEvent.asObservable();

  private _currentUser: User;
  get currentUser(): User {
    return this._currentUser;
  }

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
  }

  loginUser(data: object) {
    const user = data as User;
    user.uiConfig = userUiConfigs.find(userUiConfig => userUiConfig.email === user.email) as UiConfig;
    const messageEvent = WebSocketService.buildMessageEvent(user, WsPayloadEnum.USER, user);
    this._webSocket.next(messageEvent);

    this._currentUser = user;
    this._currentUserChangeEvent.next(user);
  }

}
