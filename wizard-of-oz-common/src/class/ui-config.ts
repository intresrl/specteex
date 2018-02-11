import * as uuc from '../config/users-ui-config';

export class UiConfig {
  private _color: string;
  private _image: string;

  get color(): string {
    return this._color;
  }

  get image(): string {
    return this._image;
  }

  constructor(color: string, image: string) {
    this._color = color;
    this._image = image;
  }

  public static buildFromObject(data: object | undefined): UiConfig {
    if (data) {
      const uiConfigData = data as UiConfig;
      return new UiConfig(uiConfigData._color, uiConfigData._image);
    } else {
      return new UiConfig('white', 'question_mark.svg');
    }
  }

  public static buildFromConfigFile(email: string): UiConfig {
    return this.buildFromObject(uuc.userUiConfigs.find(userUiConfig => userUiConfig._email === email));
  }
}
