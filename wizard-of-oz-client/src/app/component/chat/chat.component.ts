import {Component} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private _wsMessages = [];
  private _webSocket: Subject<MessageEvent>;

  get wsMessages(): any[] {
    return this._wsMessages;
  }

  constructor(private _dataService: DataService, private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => {
      const wsMessage = WebSocketUtils.parseMessageEvent(messageEvent);
      if (wsMessage.payloadType === wsPayloadEnum.ChatMessage) {
        this._wsMessages.push(wsMessage);
      }
    });
  }
}
