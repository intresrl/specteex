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
import {RetrospectiveStatus} from '../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {Subject} from 'rxjs/Subject';
import {WebSocketUtils} from '../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {WsPayloadEnum} from '../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {WebSocketService} from './websocket.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class StatusService {
  private _webSocket: Subject<MessageEvent>;

  private _currentStatusChangeEvent: BehaviorSubject<RetrospectiveStatus> = new BehaviorSubject<RetrospectiveStatus>(null);
  public readonly currentStatusChangeEvent = this._currentStatusChangeEvent.asObservable();

  private _currentStatus = RetrospectiveStatus.CHOICE_RETROSPECTIVE;
  get currentStatus(): RetrospectiveStatus {
    return this._currentStatus;
  }

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => {
      const wsMessage = WebSocketUtils.parseMessageEvent(messageEvent);
      if (wsMessage.payloadType === WsPayloadEnum.STATUS) {
        this._currentStatus = wsMessage.payload;
        this._currentStatusChangeEvent.next(wsMessage.payload);
      }
    });

  }

}
