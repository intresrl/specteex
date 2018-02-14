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

import {RetrospectiveStatus} from '../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {User} from '../../../wizard-of-oz-common/src/class/user';
import {ChatMessage} from '../../../wizard-of-oz-common/src/class/chat-message';
import {WsMessage} from '../../../wizard-of-oz-common/src/class/ws-message';
import {wsPayloadEnum} from '../../../wizard-of-oz-common/src/enum/ws-payload.enum';

class WebServerExpressController {
  public server: any;
  private _currentStatus = RetrospectiveStatus.CHOICE_RETROSPECTIVE;
  private _specteexUser = User.build('specteex', 'specteex@intre.it', false);
  private _usersMessages = new Map<string, WsMessage[]>();

  constructor() {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
      console.log(`New connection from ${request.socket.remoteAddress}:${request.socket.remotePort}`);

      const statusMessage = WsMessage.build(this._specteexUser, wsPayloadEnum.STATUS, this._currentStatus);
      ws.send(JSON.stringify(statusMessage));

      ws.on('message', (message: string) => {
        const wsMessage = WsMessage.parseWsMessage(message);
        this.logMessagePayload(wsMessage);

        if (this._currentStatus === RetrospectiveStatus.WRITE_NOTE) {
          if (wsMessage.userEmail === 'specteex@intre.it') {
            wss.clients.forEach(function each(client: WebSocket) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
          } else {
            let userMessages = this._usersMessages.get(wsMessage.userEmail);
            if (!userMessages) {
              userMessages = new Array<WsMessage>();
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

        if (wsMessage.payloadType === wsPayloadEnum.STATUS && wsMessage.rawPayload !== this._currentStatus) {
          if (wsMessage.rawPayload === RetrospectiveStatus.GROUP_NOTE) {
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
          this._currentStatus = wsMessage.rawPayload;
        }
      });

      ws.on('close', () => {
        console.log(`Close connection to ${request.socket.remoteAddress}:${request.socket.remotePort}`);
      });
    });

    this.server = server;
  }

  private logMessagePayload(wsMessage: WsMessage): void {
    switch (wsMessage.payloadType) {
      case wsPayloadEnum.USER:
        console.log(`USER ${(User.buildFromObject(wsMessage.rawPayload) as User).email}`);
        break;
      case wsPayloadEnum.CHAT_MESSAGE:
        const chatMessage = ChatMessage.buildFromObject(wsMessage.rawPayload) as ChatMessage;
        console.log(`CHAT_MESSAGE ${wsMessage.userEmail}: ${JSON.stringify(chatMessage)}`);
        break;
      case wsPayloadEnum.CLICK_BUTTON:
        console.log(`CLICK_BUTTON ${wsMessage.userEmail}: ${wsMessage.rawPayload._value}`);
        break;
      case wsPayloadEnum.STATUS:
        console.log(`STATUS ${wsMessage.userEmail}: ${wsMessage.rawPayload}`);
        break;
      default:
        console.log(`${wsMessage.userEmail}: ${wsMessage}`);
    }
  }
}

export default new WebServerExpressController().server;
