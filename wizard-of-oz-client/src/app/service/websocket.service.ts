import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {User} from '../../../../wizard-of-oz-common/class/user';

Injectable();
export class WebSocketService {
  private socket: Subject<MessageEvent>;

  public connect(url): Subject<MessageEvent> {
    if (!this.socket) {
      this.socket = this.build(url);
    }
    return this.socket;
  }

  private build(url): Subject<MessageEvent> {
    const ws = new WebSocket(url);
    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    );
    const observer = {
      next: (messageEvent: MessageEvent) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(messageEvent.data));
        }
      },
    };
    return Subject.create(observer, observable);
  }
}
