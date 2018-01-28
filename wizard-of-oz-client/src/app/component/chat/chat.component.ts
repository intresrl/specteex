import { Component } from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {DataService} from '../../service/data.service';
import {User} from '../../class/user';
import {WebSocketService} from '../../service/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private currentUser: User;
  private webSocket: Subject<MessageEvent>;
  public message: string;

  constructor(private dataService: DataService, private webSocketService: WebSocketService) {
    this.dataService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.currentUser = currentUser;
        this.webSocket = this.webSocketService.connect('ws://localhost:3000');
        this.webSocket.subscribe(messageEvent => this.message = messageEvent.data);
      }
    });
  }

  public sendMessage() {
    const message: string = 'Ciao server, io sono Gianni!';
    const messageEvent: MessageEvent = new MessageEvent('worker', {data: message});
    this.webSocket.next(messageEvent);
  }
}
