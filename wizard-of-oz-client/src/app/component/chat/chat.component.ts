import { Component } from '@angular/core';
import {DataService} from '../../service/data.service';
import {User} from '../../class/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  private currentUser: User;

  constructor(private dataService: DataService) {
    this.dataService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
  }
}
