import {v4 as uuidV4} from 'uuid';

export class WsMessage {
  private id: string;
  private timestamp: number;
  private payloadType: wsPayloadEnum;
  private payload: any;

  constructor(timestamp: number, payloadType: wsPayloadEnum, payload: any) {
    this.id = uuidV4();
    this.timestamp = timestamp;
    this.payloadType = payloadType;
    this.payload = payload;
  }
}

export enum wsPayloadEnum {
  User
}
