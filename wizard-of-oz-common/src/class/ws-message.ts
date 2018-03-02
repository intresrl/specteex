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

import {v4 as uuidV4} from 'uuid';
import {WsPayloadEnum} from '../enum/ws-payload.enum';
import {User} from '../interface/user';

export interface IWsMessage {
  readonly id: string;
  readonly user: User;
  readonly timestamp: number;
  readonly payloadType: WsPayloadEnum;
  readonly payload: any;
}

export class WsMessage implements IWsMessage {

  readonly id: string;
  readonly user: User;
  readonly timestamp: number;
  readonly payloadType: WsPayloadEnum;
  readonly payload: any;

  get userColor(): string {
    return this.user.uiConfig ? this.user.uiConfig.color : 'gray';
  }

  get userEmail(): string {
    return this.user.email;
  }

  get userImage(): string {
    return this.user.uiConfig ? this.user.uiConfig.image : 'question_mark.svg';
  }

  constructor(user: User, payloadType: WsPayloadEnum, payload: any) {
    this.id = uuidV4();
    this.user = user;
    this.timestamp = Date.now();
    this.payloadType = payloadType;
    this.payload = payload;
  }

  static fromJSON(json: IWsMessage): WsMessage {
    const wsMessage = Object.create(WsMessage.prototype);
    return Object.assign(wsMessage, json, {
      timestamp: new Date(json.timestamp)
    });
  }
}
