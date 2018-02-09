import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';

import {ChatMessage} from '../../../../wizard-of-oz-common/src/class/chat-message';
import {User} from '../../../../wizard-of-oz-common/src/class/user';
import {WsMessage, wsPayloadEnum} from '../../../../wizard-of-oz-common/src/class/ws-message';

Injectable();

export class WebSocketService {
  private subject = new Subject<MessageEvent>();
  private isWsConnected = false;

  public static buildMessageEvent(payloadType: wsPayloadEnum, data: Object): MessageEvent {
    const wsMessage = WsMessage.build('duque@intre.it', payloadType, data);
    return new MessageEvent('worker', {data: wsMessage});
  }

  public static convertToPayload(payloadType: wsPayloadEnum, data: object): object {
    switch (payloadType) {
      case wsPayloadEnum.User:
        return User.buildFromObject(data);
      case wsPayloadEnum.ChatMessage:
        return ChatMessage.buildFromObject(data);
      default:
        return data;
    }
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
