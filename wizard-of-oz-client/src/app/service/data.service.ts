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

import {User} from '../../../../wizard-of-oz-common/src/class/user';
import {WebSocketService} from './websocket.service';
import {Subject} from 'rxjs/Subject';
import {WebSocketUtils} from '../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../wizard-of-oz-common/src/enum/ws-payload.enum';

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
    const userData = data as User;
    const user = User.build(userData.nick, userData.email, userData.isScrumMaster);
    const messageEvent = WebSocketUtils.buildMessageEvent(user, wsPayloadEnum.USER, user);
    this._webSocket.next(messageEvent);

    this._currentUser = user;
    this._currentUserChangeEvent.next(user);
  }

}
