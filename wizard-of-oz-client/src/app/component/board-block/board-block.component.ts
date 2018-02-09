import {AfterViewInit, Component, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';

@Component({
  selector: 'app-board-block',
  templateUrl: './board-block.component.html',
  styleUrls: ['./board-block.component.scss']
})
export class BoardBlockComponent implements AfterViewInit {
  private _blockNumber: number;
  private _wsMessages = [];
  private _webSocket: Subject<MessageEvent>;

  get blockNumber(): number {
    return this._blockNumber;
  }

  @Input()
  set blockNumber(value: number) {
    this._blockNumber = value;
  }

  get wsMessages(): any[] {
    return this._wsMessages;
  }

  public ps: PerfectScrollbar;

  boardForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  });

  matcher = new CustomErrorStateMatcher();

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => {
      const wsMessage = WebSocketUtils.parseMessageEvent(messageEvent);
      if (wsMessage.payloadType === wsPayloadEnum.ChatMessage) {
        this._wsMessages.push(wsMessage);
      }
    });
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar(`#board_block_${this.blockNumber}`);
  }

  public sendMessage() {
    if (this.boardForm.valid) {
      const chatMessage = WebSocketUtils.convertObjectToPayload(wsPayloadEnum.ChatMessage, this.boardForm.value);
      const messageEvent = WebSocketUtils.buildMessageEvent(wsPayloadEnum.ChatMessage, chatMessage);
      this._webSocket.next(messageEvent);
    }
  }
}
