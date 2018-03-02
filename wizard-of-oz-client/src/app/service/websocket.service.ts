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
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {User} from '../../../../wizard-of-oz-common/src/interface/user';
import {WsPayloadEnum} from '../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {WsMessage} from '../../../../wizard-of-oz-common/src/class/ws-message';

Injectable();

export class WebSocketService {
  private subject = new Subject<MessageEvent>();
  private isWsConnected = false;

  public static buildMessageEvent(user: User, payloadType: WsPayloadEnum, data: Object): MessageEvent {
    const wsMessage = new WsMessage(user, payloadType, data);
    return new MessageEvent('worker', {data: wsMessage});
  }

  public connect(): Subject<MessageEvent> {
    if (!this.isWsConnected) {
      this.subject = this.build('ws://localhost:3000/');
      this.isWsConnected = true;
    }
    return this.subject;
  }

  private build(url): Subject<MessageEvent> {
    const ws = new WebSocket(url);
    const wsObservable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    );
    const wsSubject = new Subject<MessageEvent>();
    wsObservable.subscribe((messageEvent: MessageEvent) => {
      wsSubject.next(messageEvent);
    });
    const wsObserver = {
      next: (messageEvent: MessageEvent) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(messageEvent.data));
        }
      }
    };
    return Subject.create(wsObserver, wsSubject);
  }
}
