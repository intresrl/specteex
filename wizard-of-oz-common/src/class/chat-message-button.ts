export class ChatMessageButton {
  private _label: string;
  private _value: string;

  get label(): string {
    return this._label;
  }

  get value(): string {
    return this._value;
  }

  public static buildFromObject(data: object): ChatMessageButton[] {
    const chatMessageButtonsData = data as ChatMessageButton[];
    return chatMessageButtonsData.map(value => {
      const chatMessageButton = new ChatMessageButton();
      chatMessageButton._label = value._label;
      chatMessageButton._value = value._value;
      return chatMessageButton;
    });
  }
}
