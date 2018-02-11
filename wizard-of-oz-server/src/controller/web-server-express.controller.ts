import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import {ConnectionManagerService} from '../service/connection-manager.service';
import {RetrospectiveStatus} from '../../../wizard-of-oz-common/src/enum/retrospective-status.enum';
import {User} from '../../../wizard-of-oz-common/src/class/user';
import {WsMessage} from '../../../wizard-of-oz-common/src/class/ws-message';
import {wsPayloadEnum} from '../../../wizard-of-oz-common/src/enum/ws-payload.enum';

class WebServerExpressController {
  public server: any;
  private _currentStatus = RetrospectiveStatus.CHOICE_RETROSPECTIVE;
  private _specteeUser = User.build('spectee', 'scpectee@intre.it', false);

  constructor() {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});
    const connectionManager = new ConnectionManagerService();

    wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
      console.log(`New connection from ${request.socket.remoteAddress}:${request.socket.remotePort}`);

      // connectionManager.addConnection(request.socket.remoteAddress, request.socket.remotePort);
      const wsMessage = WsMessage.build(this._specteeUser, wsPayloadEnum.STATUS, this._currentStatus);
      ws.send(JSON.stringify(wsMessage));

      ws.on('message', (message: string) => {
        console.log('received: %s', message);

        if (this._currentStatus === RetrospectiveStatus.WRITE_NOTE) {
          ws.send(message);
        } else {
          wss.clients.forEach(function each(client: WebSocket) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        }

      });

      ws.on('close', () => {
        // connectionManager.deleteConnection(request.socket.remoteAddress, request.socket.remotePort);
        console.log(`Close connection to ${request.socket.remoteAddress}:${request.socket.remotePort}`);
      });

      // ws.send('Hi there, I am a WebSocket server');
    });

    this.server = server;
  }
}

export default new WebServerExpressController().server;
