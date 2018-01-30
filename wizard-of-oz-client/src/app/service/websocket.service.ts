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
      const wsSubject = this.build('ws://localhost:3000/');
      wsSubject.subscribe((messageEvent: MessageEvent) => this.subject.next(messageEvent));
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
    const wsObserver = {
      next: (messageEvent: MessageEvent) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(messageEvent.data));
        }
      }
    };
    return Subject.create(wsObserver, wsObservable);
  }
}
