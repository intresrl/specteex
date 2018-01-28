import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {User} from '../class/user';

@Injectable()
export class DataService {
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public readonly currentUser = this._currentUser.asObservable();

  loginUser(user: User) {
    this._currentUser.next(user);
  }

}
