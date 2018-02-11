export class ChatMessage {
  public static readonly messageRegExp = new RegExp('^(#([\\w\\d]+):)?\\s?([\\w\\W]+)$');
  message: string;
  board?: string;

  public static buildFromObject(data: object): ChatMessage {
    const chatMessageData = data as ChatMessage;
    const chatMessage = new ChatMessage();
    const regExpMatches = this.messageRegExp.exec(chatMessageData.message);
    const board = chatMessageData.board ? chatMessageData.board : regExpMatches[2];
    chatMessage.board = board ? board.toLowerCase() : undefined;
    chatMessage.message = regExpMatches[3];
    return chatMessage;
  }

  public static build(message: string, board: string): ChatMessage {
    const chatMessage = new ChatMessage();
    chatMessage.message = message;
    chatMessage.board = board;
    return chatMessage;
  }
}
