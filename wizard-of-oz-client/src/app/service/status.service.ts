import {Injectable} from '@angular/core';
import {RetrospectiveStatus} from '../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {Subject} from 'rxjs/Subject';
import {WebSocketUtils} from '../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
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
      if (wsMessage.payloadType === wsPayloadEnum.STATUS) {
        this._currentStatus = wsMessage.payload;
        this._currentStatusChangeEvent.next(wsMessage.payload);
      }
    });

  }

}
