import {Component} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-board-block',
  templateUrl: './board-block.component.html',
  styleUrls: ['./board-block.component.scss']
})
export class BoardBlockComponent {
  private _webSocket: Subject<MessageEvent>;

  public message = 'connecting ...';

  boardForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  });

  matcher = new CustomErrorStateMatcher();

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => this.message = messageEvent.data);
  }

  public sendMessage() {
    if (this.boardForm.valid) {
      const messageEvent: MessageEvent = new MessageEvent('worker', {data: this.boardForm.value});
      this._webSocket.next(messageEvent);
    }
  }
}
