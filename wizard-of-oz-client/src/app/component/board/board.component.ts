import {Component} from '@angular/core';
import {StatusService} from '../../service/status.service';
import {RetrospectiveStatus} from '../../../../../wizard-of-oz-common/src/enum/retrospective-status.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  constructor(private _statusService: StatusService) {
  }

  get isEnabled(): boolean {
    const currentStatus = this._statusService.currentStatus;
    return currentStatus !== RetrospectiveStatus.CHOICE_RETROSPECTIVE;
  }
}
