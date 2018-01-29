import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';

import {DataService} from '../../service/data.service';
import {User} from '../../../../../wizard-of-oz-common/class/user';
import {WebSocketService} from '../../service/websocket.service';
import {CustomErrorStateMatcher} from '../../service/form.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private currentUser: User;
  private webSocket: Subject<MessageEvent>;
  public message: string;

  chatForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  });

  matcher = new CustomErrorStateMatcher();

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
    const messageEvent: MessageEvent = new MessageEvent('worker', {data: this.chatForm.value});
    this.webSocket.next(messageEvent);
  }
}
