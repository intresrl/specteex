import {Component} from '@angular/core';
import {StatusService} from './service/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private _statusService: StatusService) {
  }
}
