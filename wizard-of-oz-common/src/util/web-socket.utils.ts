import {WsMessage} from '../class/ws-message';
import {ChatMessage} from '../class/chat-message';
import {User} from '../class/user';
import {wsPayloadEnum} from '../enum/ws-payload.enum';

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

  public static convertObjectToPayload(payloadType: wsPayloadEnum, data: object): object {
    switch (payloadType) {
      case wsPayloadEnum.User:
        return User.buildFromObject(data) as User;
      case wsPayloadEnum.ChatMessage:
        return ChatMessage.buildFromObject(data) as ChatMessage;
      default:
        return data;
    }
  }

}
