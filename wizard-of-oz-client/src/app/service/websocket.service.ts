import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';

Injectable();

export class WebSocketService {
  private subject = new Subject<MessageEvent>();
  private isWsConnected = false;

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
