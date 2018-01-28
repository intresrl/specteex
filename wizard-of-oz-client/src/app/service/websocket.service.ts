import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';

Injectable();
export class WebSocketService {
  private socket: Subject<MessageEvent>;

  public connect(url): Subject<MessageEvent> {
    if(!this.socket) {
      this.socket = this.create(url);
    }
    return this.socket;
  }

  private create(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    );
    let observer = {
      next: (messageEvent: MessageEvent) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageEvent.data);
        }
      },
    };
    return Subject.create(observer, observable);
  }
}
