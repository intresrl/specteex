import {UiConfig} from './ui-config';

export class User {
  nick: string;
  email: string;
  isScrumMaster: boolean;
  uiConfig?: UiConfig;

  public static buildFromObject(data: object): User {
    const userData = data as User;
    const user = new User();
    user.nick = userData.nick;
    user.email = userData.email;
    user.isScrumMaster = userData.isScrumMaster;
    user.uiConfig = userData.uiConfig ? UiConfig.buildFromObject(userData.uiConfig) : UiConfig.buildFromConfigFile(userData.email);
    return user;
  }

  public static build(nick: string, email: string, isScrumMaster: boolean): User {
    const user = new User();
    user.nick = nick;
    user.email = email;
    user.isScrumMaster = isScrumMaster;
    user.uiConfig = UiConfig.buildFromConfigFile(email);
    return user;
  }
}
