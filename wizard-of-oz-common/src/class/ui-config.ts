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

import * as uuc from '../config/users-ui-config';

export class UiConfig {
  private _color: string;
  private _image: string;

  get color(): string {
    return this._color;
  }

  get image(): string {
    return this._image;
  }

  constructor(color: string, image: string) {
    this._color = color;
    this._image = image;
  }

  public static buildFromObject(data: object | undefined): UiConfig {
    if (data) {
      const uiConfigData = data as UiConfig;
      return new UiConfig(uiConfigData._color, uiConfigData._image);
    } else {
      return new UiConfig('white', 'question_mark.svg');
    }
  }

  public static buildFromConfigFile(email: string): UiConfig {
    return this.buildFromObject(uuc.userUiConfigs.find(userUiConfig => userUiConfig._email === email));
  }
}
