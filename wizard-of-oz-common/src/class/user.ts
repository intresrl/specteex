import {UiConfig} from './ui-config';
import {WsMessage} from './ws-message';

export class User {
  private _nick: string;
  private _email: string;
  private _isScrumMaster: boolean;
  private _uiConfig?: UiConfig;

  get nick(): string {
    return this._nick;
  }

  get email(): string {
    return this._email;
  }

  get isScrumMaster(): boolean {
    return this._isScrumMaster;
  }

  get uiConfig(): UiConfig | undefined {
    return this._uiConfig;
  }

  public static buildFromObject(data: object): User {
    const userData = data as User;
    const user = new User();
    user._nick = userData._nick;
    user._email = userData._email;
    user._isScrumMaster = userData._isScrumMaster;
    user._uiConfig = userData._uiConfig ? UiConfig.buildFromObject(userData._uiConfig) : UiConfig.buildFromConfigFile(userData._email);
    return user;
  }

  public static build(nick: string, email: string, isScrumMaster: boolean): User {
    const user = new User();
    user._nick = nick;
    user._email = email;
    user._isScrumMaster = isScrumMaster;
    user._uiConfig = UiConfig.buildFromConfigFile(email);
    return user;
  }
}
