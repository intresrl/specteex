export class User {
  nick: string;
  email: string;
  isScrumMaster: boolean;

  constructor(nick: string, email: string, isScrumMaster: boolean) {
    this.nick = nick;
    this.email = email;
    this.isScrumMaster = isScrumMaster;
  }

  public static build(data: object) {
    const userData = data as User;
    return new User(userData.nick, userData.email, userData.isScrumMaster);
  }
}
