import {Component} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {WebSocketService} from '../../service/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private _webSocket: Subject<MessageEvent>;

  public message = 'connecting ...';

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
    this._webSocket.subscribe(messageEvent => this.message = messageEvent.data);
  }
}
