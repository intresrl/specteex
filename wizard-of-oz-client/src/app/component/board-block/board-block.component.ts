import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';

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
      const wsMessage = WebSocketUtils.parseMessageEvent(messageEvent);
      if (wsMessage.payloadType === wsPayloadEnum.CHAT_MESSAGE && this.blockName.toLowerCase() === wsMessage.payload.board) {
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
      const chatMessage = WebSocketUtils.convertObjectToPayload(wsPayloadEnum.CHAT_MESSAGE, this.boardForm.value);
      const messageEvent = WebSocketUtils.buildMessageEvent(this._dataService.currentUser, wsPayloadEnum.CHAT_MESSAGE, chatMessage);
      this._webSocket.next(messageEvent);
      this.boardForm.reset({board: this.blockName});
    }
  }
}
