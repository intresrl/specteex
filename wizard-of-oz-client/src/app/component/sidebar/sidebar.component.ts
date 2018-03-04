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

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {WsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {ChatMessage} from '../../../../../wizard-of-oz-common/src/class/chat-message';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnInit {
  private _webSocket: Subject<MessageEvent>;

  public ps: PerfectScrollbar;
  chatForm: FormGroup;

  get isEnabled(): boolean {
    const currentStatus = this._statusService.currentStatus;
    return currentStatus === RetrospectiveStatus.WRITE_NOTE
      || (this._dataService.currentUser.isScrumMaster
        && currentStatus !== RetrospectiveStatus.GROUP_NOTE);
  }

  matcher = new CustomErrorStateMatcher();

  constructor(private _dataService: DataService, private _webSocketService: WebSocketService, private _statusService: StatusService) {
    this._webSocket = this._webSocketService.connect();
  }

  ngOnInit(): void {
    this.chatForm = new FormGroup({
      message: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar('#chat');
  }

  public sendMessage() {
    if (this.chatForm.valid) {
      const chatMessage = new ChatMessage(this.chatForm.value.message);
      const messageEvent = WebSocketService.buildMessageEvent(this._dataService.currentUser, WsPayloadEnum.CHAT_MESSAGE, chatMessage);
      this._webSocket.next(messageEvent);
      this.chatForm.reset();
    }
  }
}
