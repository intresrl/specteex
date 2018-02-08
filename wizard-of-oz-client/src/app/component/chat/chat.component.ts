import {Component} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private _messages = [];
  private _webSocket: Subject<MessageEvent>;

  get messages(): any[] {
    return this._messages;
  }

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => this._messages.push(messageEvent.data));
  }
}
