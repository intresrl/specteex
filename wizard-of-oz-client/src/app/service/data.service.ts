import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {User} from '../../../../wizard-of-oz-common/src/class/user';

@Injectable()
export class DataService {
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public readonly currentUser = this._currentUser.asObservable();

  loginUser(user: object) {
    this._currentUser.next(User.buildFromObject(user));
  }

}
