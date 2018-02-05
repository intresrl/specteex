import {AfterViewInit, Component} from '@angular/core';
import {CustomErrorStateMatcher} from '../../service/form.service';
import {WebSocketService} from '../../service/websocket.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import PerfectScrollbar from 'perfect-scrollbar';

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
      const messageEvent: MessageEvent = new MessageEvent('worker', {data: this.chatForm.value});
      this._webSocket.next(messageEvent);
    }
  }
}
