/*
 * Copyright (C)  2018  Gianni Bombelli & Emanuele Mantovani @ Intré S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {UiConfig} from './ui-config';
import {WsMessage} from './ws-message';

export class User {
  private _nick: string;
  private _email: string;
  private _isScrumMaster: boolean;
  private _uiConfig?: UiConfig;

  get nick(): string {
    return this._nick;
  }

  get email(): string {
    return this._email;
  }

  get isScrumMaster(): boolean {
    return this._isScrumMaster;
  }

  get uiConfig(): UiConfig | undefined {
    return this._uiConfig;
  }

  public static buildFromObject(data: object): User {
    const userData = data as User;
    const user = new User();
    user._nick = userData._nick;
    user._email = userData._email;
    user._isScrumMaster = userData._isScrumMaster;
    user._uiConfig = userData._uiConfig ? UiConfig.buildFromObject(userData._uiConfig) : UiConfig.buildFromConfigFile(userData._email);
    return user;
  }

  public static build(nick: string, email: string, isScrumMaster: boolean): User {
    const user = new User();
    user._nick = nick;
    user._email = email;
    user._isScrumMaster = isScrumMaster;
    user._uiConfig = UiConfig.buildFromConfigFile(email);
    return user;
  }
}
