import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

import {WebSocketService} from '../../service/websocket.service';
import {WebSocketUtils} from '../../../../../wizard-of-oz-common/src/util/web-socket.utils';
import {wsPayloadEnum} from '../../../../../wizard-of-oz-common/src/enum/ws-payload.enum';
import {DataService} from '../../service/data.service';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnInit {
  private _webSocket: Subject<MessageEvent>;

  public ps: PerfectScrollbar;
  chatForm: FormGroup;

  get isEnabled(): boolean {
    const currentStatus = this._statusService.currentStatus;
    return currentStatus === RetrospectiveStatus.WRITE_NOTE
      || (this._dataService.currentUser.isScrumMaster
        && currentStatus !== RetrospectiveStatus.GROUP_NOTE);
  }

  matcher = new CustomErrorStateMatcher();

  constructor(private _dataService: DataService, private _webSocketService: WebSocketService, private _statusService: StatusService) {
    this._webSocket = this._webSocketService.connect();
  }

  ngOnInit(): void {
    this.chatForm = new FormGroup({
      message: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngAfterViewInit(): void {
    this.ps = new PerfectScrollbar('#chat');
  }

  public sendMessage() {
    if (this.chatForm.valid) {
      const chatMessage = WebSocketUtils.convertObjectToPayload(wsPayloadEnum.CHAT_MESSAGE, this.chatForm.value);
      const messageEvent = WebSocketUtils.buildMessageEvent(this._dataService.currentUser, wsPayloadEnum.CHAT_MESSAGE, chatMessage);
      this._webSocket.next(messageEvent);
      this.chatForm.reset();
    }
  }
}
