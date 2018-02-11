import {WsMessage} from '../class/ws-message';
import {ChatMessage} from '../class/chat-message';
import {User} from '../class/user';
import {wsPayloadEnum} from '../enum/ws-payload.enum';
import {RetrospectiveStatus} from '../enum/retrospective-status.enum';

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

  public static convertObjectToPayload(payloadType: wsPayloadEnum, data: any): any {
    switch (payloadType) {
      case wsPayloadEnum.USER:
        return User.buildFromObject(data) as User;
      case wsPayloadEnum.CHAT_MESSAGE:
        return ChatMessage.buildFromObject(data) as ChatMessage;
      case wsPayloadEnum.STATUS:
        return data as RetrospectiveStatus;
      default:
        return data;
    }
  }

}
