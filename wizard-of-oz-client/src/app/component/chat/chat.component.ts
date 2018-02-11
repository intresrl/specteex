import {Component} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';

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

  get isEnabled(): boolean {
    const currentStatus = this._statusService.currentStatus;
    return currentStatus === RetrospectiveStatus.WRITE_NOTE
      || (this._dataService.currentUser.isScrumMaster
        && currentStatus !== RetrospectiveStatus.GROUP_NOTE);
  }

  constructor(private _dataService: DataService, private _webSocketService: WebSocketService, private _statusService: StatusService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => {
      const wsMessage = WebSocketUtils.parseMessageEvent(messageEvent);
      if (wsMessage.payloadType === wsPayloadEnum.CHAT_MESSAGE) {
        this._wsMessages.push(wsMessage);
      }
    });
  }

  public clickButton(value: string): void {
    if (this.isEnabled) {
      const clickButtonMessage = WebSocketUtils.convertObjectToPayload(wsPayloadEnum.CLICK_BUTTON, value);
      const messageEvent = WebSocketUtils.buildMessageEvent(this._dataService.currentUser, wsPayloadEnum.CLICK_BUTTON, clickButtonMessage);
      this._webSocket.next(messageEvent);
    }
  }
}
