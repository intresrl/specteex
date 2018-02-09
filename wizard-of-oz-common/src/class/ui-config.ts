import {userUiConfigs} from './users-ui-config';

export class UiConfig {
  color: string;
  image: string;

  constructor(color: string, image: string) {
    this.color = color;
    this.image = image;
  }

  public static buildFromObject(data: object | undefined): UiConfig {
    if (data) {
      const uiConfigData = data as UiConfig;
      return new UiConfig(uiConfigData.color, uiConfigData.image);
    } else {
      return new UiConfig('white', 'question_mark.svg');
    }
  }

  public static buildFromConfigFile(email: string): UiConfig {
    return this.buildFromObject(userUiConfigs.find(userUiConfig => userUiConfig.email === email));
  }
}
