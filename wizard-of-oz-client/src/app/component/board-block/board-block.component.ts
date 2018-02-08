import {AfterViewInit, Component, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-board-block',
  templateUrl: './board-block.component.html',
  styleUrls: ['./board-block.component.scss']
})
export class BoardBlockComponent implements AfterViewInit {
  private _blockNumber: number;
  private _messages = [];
  private _webSocket: Subject<MessageEvent>;

  get blockNumber(): number {
    return this._blockNumber;
  }

  @Input()
  set blockNumber(value: number) {
    this._blockNumber = value;
  }

  get messages(): any[] {
    return this._messages;
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
    this._webSocket.subscribe(messageEvent => this._messages.push(messageEvent.data));
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar(`#board_block_${this.blockNumber}`);
  }

  public sendMessage() {
    if (this.boardForm.valid) {
      const messageEvent: MessageEvent = new MessageEvent('worker', {data: this.boardForm.value});
      this._webSocket.next(messageEvent);
    }
  }
}
