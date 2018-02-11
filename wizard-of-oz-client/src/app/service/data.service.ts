import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {User} from '../../../../wizard-of-oz-common/src/class/user';

@Injectable()
export class DataService {
  private _currentUserChangeEvent: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public readonly currentUserChangeEvent = this._currentUserChangeEvent.asObservable();

  private _currentUser: User;
  get currentUser(): User {
    return this._currentUser;
  }

  loginUser(user: User) {
    this._currentUser = user;
    this._currentUserChangeEvent.next(user);
  }

}
