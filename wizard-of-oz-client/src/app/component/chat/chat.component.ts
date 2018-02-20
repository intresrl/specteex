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

import {Component} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {WsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {ChatMessageButton} from '../../../../../wizard-of-oz-common/src/interface/chat-message-button';

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
      if (wsMessage.payloadType === WsPayloadEnum.CHAT_MESSAGE) {
        this._wsMessages.push(wsMessage);
      }
    });
  }

  public clickButton(buttons: ChatMessageButton[], value: string): void {
    if (this.isEnabled) {
      buttons.forEach(button => button.selected = button.value === value);
      const clickButtonMessage = WebSocketUtils.convertObjectToPayload(WsPayloadEnum.CLICK_BUTTON, value);
      const messageEvent = WebSocketUtils.buildMessageEvent(this._dataService.currentUser, WsPayloadEnum.CLICK_BUTTON, clickButtonMessage);
      this._webSocket.next(messageEvent);
    }
  }
}
