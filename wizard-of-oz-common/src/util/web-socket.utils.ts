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

import {WsMessage} from '../class/ws-message';
import {ChatMessage} from '../class/chat-message';
import {User} from '../class/user';
import {wsPayloadEnum} from '../enum/ws-payload.enum';
import {RetrospectiveStatus} from '../enum/retrospective-status.enum';
import {ClickButton} from '../class/click-button';

export class WebSocketUtils {

  public static buildMessageEvent(user: User, payloadType: wsPayloadEnum, data: Object): MessageEvent {
    const wsMessage = WsMessage.build(user, payloadType, data);
    return new MessageEvent('worker', {data: wsMessage});
  }

  public static parseMessageEvent(messageEvent: MessageEvent): WsMessage {
    const wsMessage = WsMessage.parseWsMessage(messageEvent.data);
    wsMessage.payload = this.convertObjectToPayload(wsMessage.payloadType, wsMessage.rawPayload);
    return wsMessage;
  }

  public static convertObjectToPayload(payloadType: wsPayloadEnum, data: any): any {
    switch (payloadType) {
      case wsPayloadEnum.USER:
        return User.buildFromObject(data) as User;
      case wsPayloadEnum.CHAT_MESSAGE:
        return ChatMessage.buildFromObject(data) as ChatMessage;
      case wsPayloadEnum.CLICK_BUTTON:
        return new ClickButton(data);
      case wsPayloadEnum.STATUS:
        return data as RetrospectiveStatus;
      default:
        return data;
    }
  }

}
