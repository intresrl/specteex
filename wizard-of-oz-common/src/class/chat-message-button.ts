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
