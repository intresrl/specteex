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
          let userMessages = this._usersMessages.get(wsMessage.userEmail);
          if (!userMessages) {
            userMessages = new Array<WsMessage>();
          }
          userMessages.push(wsMessage);
          this._usersMessages.set(wsMessage.userEmail, userMessages);

          ws.send(message);
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
