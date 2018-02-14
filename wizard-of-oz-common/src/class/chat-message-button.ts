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

export class ChatMessageButton {
  private _label: string;
  private _value: string;
  private _selected: boolean;

  get label(): string {
    return this._label;
  }

  get value(): string {
    return this._value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  public static buildFromObject(data: object): ChatMessageButton[] {
    const chatMessageButtonsData = data as ChatMessageButton[];
    return chatMessageButtonsData.map(value => {
      const chatMessageButton = new ChatMessageButton();
      chatMessageButton._label = value._label;
      chatMessageButton._value = value._value;
      chatMessageButton._selected = false;
      return chatMessageButton;
    });
  }
}
