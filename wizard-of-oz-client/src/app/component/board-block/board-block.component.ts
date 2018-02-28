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

import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {WsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {WsMessage, IWsMessage} from '../../../../../wizard-of-oz-common/src/class/ws-message';
import {ChatMessage} from '../../../../../wizard-of-oz-common/src/interface/chat-message';

@Component({
  selector: 'app-board-block',
  templateUrl: './board-block.component.html',
  styleUrls: ['./board-block.component.scss']
})
export class BoardBlockComponent implements AfterViewInit, OnInit {
  private _blockNumber: number;
  private _blockName: string;
  private _wsMessages = [];
  private _webSocket: Subject<MessageEvent>;

  get blockNumber(): number {
    return this._blockNumber;
  }

  @Input()
  set blockNumber(value: number) {
    this._blockNumber = value;
  }

  get blockName(): string {
    return this._blockName;
  }

  @Input()
  set blockName(value: string) {
    this._blockName = value;
  }

  get wsMessages(): any[] {
    return this._wsMessages;
  }

  public ps: PerfectScrollbar;

  boardForm: FormGroup;

  get isEnabled(): boolean {
    const currentStatus = this._statusService.currentStatus;
    return currentStatus === RetrospectiveStatus.WRITE_NOTE
      || (this._dataService.currentUser.isScrumMaster
        && currentStatus === RetrospectiveStatus.ADD_ACTION);
  }

  matcher = new CustomErrorStateMatcher();

  constructor(private _dataService: DataService, private _webSocketService: WebSocketService, private _statusService: StatusService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => {
      const wsMessage = WsMessage.fromJSON(JSON.parse(messageEvent.data) as IWsMessage);
      if (wsMessage.payloadType === WsPayloadEnum.CHAT_MESSAGE && this.blockName.toLowerCase() === wsMessage.payload.board) {
        this._wsMessages.push(wsMessage);
      }
    });
  }

  ngOnInit(): void {
    this.boardForm = new FormGroup({
      message: new FormControl('', [
        Validators.required
      ]),
      board: new FormControl(this.blockName)
    });
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar(`#board_block_${this.blockNumber}`);
  }

  public sendMessage() {
    if (this.boardForm.valid) {
      const chatMessage = this.boardForm.value as ChatMessage;
      const messageEvent = WebSocketUtils.buildMessageEvent(this._dataService.currentUser, WsPayloadEnum.CHAT_MESSAGE, chatMessage);
      this._webSocket.next(messageEvent);
      this.boardForm.reset({board: this.blockName});
    }
  }
}
