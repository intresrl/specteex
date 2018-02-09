import {v4 as uuidV4} from 'uuid';

export class WsMessage {
  private id: string;
  private userId: string;
  private timestamp: number;
  private payloadType: wsPayloadEnum;
  private payload: any;

  public static buildFromString(data: object): WsMessage {
    const message = data as WsMessage;
    const wsMessage = new WsMessage();
    wsMessage.id = message.id;
    wsMessage.userId = message.userId;
    wsMessage.timestamp = message.timestamp;
    wsMessage.payloadType = message.payloadType;
    wsMessage.payload = message.payload;
    return wsMessage;
  }

  public static build(userId: string, payloadType: wsPayloadEnum, payload: any): WsMessage {
    const wsMessage = new WsMessage();
    wsMessage.id = uuidV4();
    wsMessage.userId = userId;
    wsMessage.timestamp = Date.now();
    wsMessage.payloadType = payloadType;
    wsMessage.payload = payload;
    return wsMessage;
  }
}

export enum wsPayloadEnum {
  ChatMessage,
  User
}
