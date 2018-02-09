import {v4 as uuidV4} from 'uuid';
import {wsPayloadEnum} from '../enum/ws-payload.enum';

export class WsMessage {
  private _id: string;
  private _userId: string;
  private _timestamp: number;
  private _payloadType: wsPayloadEnum;
  private _payload: object;
  private _rawPayload: any;

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get timestamp(): number {
    return this._timestamp;
  }

  get payloadType(): wsPayloadEnum {
    return this._payloadType;
  }

  get payload(): object {
    return this._payload;
  }

  set payload(value: object) {
    this._payload = value;
  }

  get rawPayload(): any {
    return this._rawPayload;
  }

  public static buildFromObject(data: string): WsMessage {
    const message = JSON.parse(data) as WsMessage;
    const wsMessage = new WsMessage();
    wsMessage._id = message._id;
    wsMessage._userId = message._userId;
    wsMessage._timestamp = message._timestamp;
    wsMessage._payloadType = message._payloadType;
    wsMessage._rawPayload = message._rawPayload ? message._rawPayload : message._payload;
    return wsMessage;
  }

  public static build(userId: string, payloadType: wsPayloadEnum, payload: any): WsMessage {
    const wsMessage = new WsMessage();
    wsMessage._id = uuidV4();
    wsMessage._userId = userId;
    wsMessage._timestamp = Date.now();
    wsMessage._payloadType = payloadType;
    wsMessage._payload = payload;
    return wsMessage;
  }
}

