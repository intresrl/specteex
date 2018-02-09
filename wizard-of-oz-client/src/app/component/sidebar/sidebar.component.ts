import {AfterViewInit, Component} from '@angular/core';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
  private _webSocket: Subject<MessageEvent>;

  public ps: PerfectScrollbar;
  chatForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  });

  matcher = new CustomErrorStateMatcher();

  constructor(private _webSocketService: WebSocketService) {
    this._webSocket = this._webSocketService.connect();
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar('#chat');
  }

  public sendMessage() {
    if (this.chatForm.valid) {
      const chatMessage = WebSocketUtils.convertObjectToPayload(wsPayloadEnum.ChatMessage, this.chatForm.value);
      const messageEvent = WebSocketUtils.buildMessageEvent(wsPayloadEnum.ChatMessage, chatMessage);
      this._webSocket.next(messageEvent);
      this.chatForm.reset();
    }
  }
}
