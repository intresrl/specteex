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

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import {userUiConfigs} from '../../../wizard-of-oz-common/src/config/users-ui-config';

import {ChatMessage} from '../../../wizard-of-oz-common/src/interface/chat-message';
import {RetrospectiveStatus} from '../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {UiConfig} from '../../../wizard-of-oz-common/src/interface/ui-config';
import {User} from '../../../wizard-of-oz-common/src/interface/user';
import {IWsMessage, WsMessage} from '../../../wizard-of-oz-common/src/class/ws-message';
import {WsPayloadEnum} from '../../../wizard-of-oz-common/src/enum/ws-payload.enum';

class WebServerExpressController {
  public server: any;
  private _currentStatus = RetrospectiveStatus.CHOICE_RETROSPECTIVE;
  private _specteexUiConfig = userUiConfigs.find(userUiConfig => userUiConfig.email === 'specteex@intre.it') as UiConfig;
  private _specteexUser = {nick: 'specteex', email: 'specteex@intre.it', isScrumMaster: false, uiConfig: this._specteexUiConfig} as User;
  private _usersMessages = new Map<string, WsMessage[]>();

  constructor() {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
      console.log(`New connection from ${request.socket.remoteAddress}:${request.socket.remotePort}`);

      const statusMessage = new WsMessage(this._specteexUser, WsPayloadEnum.STATUS, this._currentStatus);
      ws.send(JSON.stringify(statusMessage));

      ws.on('message', (message: string) => {
        const wsMessage: WsMessage = WsMessage.fromJSON(JSON.parse(message) as IWsMessage);
        WebServerExpressController.logMessagePayload(wsMessage);

        if (this._currentStatus === RetrospectiveStatus.WRITE_NOTE) {
          if (wsMessage.userEmail === this._specteexUser.email) {
            wss.clients.forEach(function each(client: WebSocket) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
          } else {
            let userMessages = this._usersMessages.get(wsMessage.userEmail);
            if (!userMessages) {
              userMessages = [];
            }
            userMessages.push(wsMessage);
            this._usersMessages.set(wsMessage.userEmail, userMessages);

            ws.send(message);
          }
        } else {
          wss.clients.forEach(function each(client: WebSocket) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        }

        if (wsMessage.payloadType === WsPayloadEnum.STATUS && wsMessage.payload !== this._currentStatus) {
          if (wsMessage.payload === RetrospectiveStatus.GROUP_NOTE) {
            this._usersMessages.forEach(userMessages => {
              userMessages.forEach(userMessage => {
                wss.clients.forEach(client => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(userMessage));
                  }
                });
              });
            });
          }
          this._currentStatus = wsMessage.payload;
        }
      });

      ws.on('close', () => {
        console.log(`Close connection to ${request.socket.remoteAddress}:${request.socket.remotePort}`);
      });
    });

    this.server = server;
  }

  private static logMessagePayload(wsMessage: WsMessage): void {
    switch (wsMessage.payloadType) {
      case WsPayloadEnum.USER:
        console.log(`USER ${(wsMessage.payload as User).email}`);
        break;
      case WsPayloadEnum.CHAT_MESSAGE:
        const chatMessage = wsMessage.payload as ChatMessage;
        console.log(`CHAT_MESSAGE ${wsMessage.userEmail}: ${JSON.stringify(chatMessage)}`);
        break;
      case WsPayloadEnum.CLICK_BUTTON:
        console.log(`CLICK_BUTTON ${wsMessage.userEmail}: ${wsMessage.payload.value}`);
        break;
      case WsPayloadEnum.STATUS:
        console.log(`STATUS ${wsMessage.userEmail}: ${wsMessage.payload}`);
        break;
      default:
        console.log(`${wsMessage.userEmail}: ${wsMessage}`);
    }
  }
}

export default new WebServerExpressController().server;
