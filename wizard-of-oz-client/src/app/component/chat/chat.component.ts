import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input('webSocket')
  private _webSocket: Subject<MessageEvent>;

  public message = 'connecting ...';

  chatForm = new FormGroup({
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
    if (this.chatForm.valid) {
      const messageEvent: MessageEvent = new MessageEvent('worker', {data: this.chatForm.value});
      this._webSocket.next(messageEvent);
    }
  }
}
