import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

import {ConnectionManagerService} from '../service/connection-manager.service';

class WebServerExpressController {
  public server: any;

  constructor() {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({server});
    const connectionManager = new ConnectionManagerService();

    wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
      connectionManager.addConnection(request.socket.remoteAddress, request.socket.remotePort);
      console.log(`New connection from ${request.socket.remoteAddress}:${request.socket.remotePort}`);

      ws.on('message', (message: string) => {
        console.log('received: %s', message);

        // broadcast
        wss.clients.forEach(function each(client: WebSocket) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });

        // echo
        // ws.send(`Hello, you sent -> ${message}`);
      });

      ws.on('close', () => {
        connectionManager.deleteConnection(request.socket.remoteAddress, request.socket.remotePort);
        console.log(`Close connection to ${request.socket.remoteAddress}:${request.socket.remotePort}`);
      });

      ws.send('Hi there, I am a WebSocket server');
    });

    this.server = server;
  }
}

export default new WebServerExpressController().server;
