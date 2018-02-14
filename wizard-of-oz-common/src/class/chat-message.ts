/*
 * Copyright (C)  2018  Gianni Bombelli & Emanuele Mantovani @ Intré S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {ChatMessageButton} from './chat-message-button';

export class ChatMessage {
  public static readonly messageRegExp = new RegExp('^(#([\\w\\d]+):)?\\s?([\\w\\W]+)$');
  message: string;
  board?: string;
  buttons?: ChatMessageButton[];

  public static buildFromObject(data: object): ChatMessage {
    const chatMessageData = data as ChatMessage;
    const chatMessage = new ChatMessage();
    const regExpMatches = this.messageRegExp.exec(chatMessageData.message);
    const board = chatMessageData.board ? chatMessageData.board : regExpMatches[2];
    chatMessage.board = board ? board.toLowerCase() : undefined;
    chatMessage.message = regExpMatches[3];
    if (chatMessageData.buttons) {
      chatMessage.buttons = ChatMessageButton.buildFromObject(chatMessageData.buttons);
    }
    return chatMessage;
  }

  public static build(message: string, board: string): ChatMessage {
    const chatMessage = new ChatMessage();
    chatMessage.message = message;
    chatMessage.board = board;
    return chatMessage;
  }
}
