export class ChatMessage {
  message: string;
  board: string;

  public static buildFromObject(data: object): ChatMessage {
    const chatMessageData = data as ChatMessage;
    const chatMessage = new ChatMessage();
    chatMessage.message = chatMessageData.message;
    chatMessage.board = '';
    return chatMessage;
  }

  public static build(message: string, board: string): ChatMessage {
    const chatMessage = new ChatMessage();
    chatMessage.message = message;
    chatMessage.board = board;
    return chatMessage;
  }
}
