import {v4 as uuidV4} from 'uuid';
import {wsPayloadEnum} from '../enum/ws-payload.enum';
import {User} from './user';

export class WsMessage {
  private _id: string;
  private _user: User;
  private _timestamp: number;
  private _payloadType: wsPayloadEnum;
  private _payload: any;
  private _rawPayload: any;

  get id(): string {
    return this._id;
  }

  get user(): User {
    return this._user;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get payloadType(): wsPayloadEnum {
    return this._payloadType;
  }

  get payload(): any {
    return this._payload;
  }

  set payload(value: any) {
    this._payload = value;
  }

  get rawPayload(): any {
    return this._rawPayload;
  }

  get userEmail(): string {
    return this._user.email;
  }

  get userColor(): string {
    return this._user.uiConfig.color;
  }

  get userImage(): string {
    return this._user.uiConfig.image;
  }

  public static parseWsMessage(data: string): WsMessage {
    const message = JSON.parse(data) as WsMessage;
    const wsMessage = new WsMessage();
    wsMessage._id = message._id;
    wsMessage._user = User.buildFromObject(message._user);
    wsMessage._timestamp = message._timestamp;
    wsMessage._payloadType = message._payloadType;
    wsMessage._rawPayload = message._rawPayload ? message._rawPayload : message._payload;
    return wsMessage;
  }

  public static build(user: User, payloadType: wsPayloadEnum, payload: any): WsMessage {
    const wsMessage = new WsMessage();
    wsMessage._id = uuidV4();
    wsMessage._user = user;
    wsMessage._timestamp = Date.now();
    wsMessage._payloadType = payloadType;
    wsMessage._payload = payload;
    return wsMessage;
  }
}

