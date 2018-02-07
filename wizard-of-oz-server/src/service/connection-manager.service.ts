import {v4 as uuidV4} from 'uuid';
import {User} from '../../../wizard-of-oz-common/class/user';

export class ConnectionManagerService {
  private connectionMap: Map<string, Connection>;

  public addConnection(remoteAddress?: string, remotePort?: number): { key?: string, error?: string } {
    const result: { key?: string, error?: string } = {};
    if (remoteAddress && remotePort) {
      const key = `${remoteAddress}:${remotePort}`;
      if (!this.connectionMap.has(key)) {
        this.connectionMap.set(key, new Connection(remoteAddress, remotePort));
      }
      result.key = key;
    } else {
      result.error = 'I can not manage connection without either remoteAddress and remotePort';
    }
    return result;
  }

  public deleteConnection(remoteAddress?: string, remotePort?: number): { key?: string, error?: string } {
    const result: { key?: string, error?: string } = {};
    if (remoteAddress && remotePort) {
      const key = `${remoteAddress}:${remotePort}`;
      if (!this.connectionMap.has(key)) {
        this.connectionMap.delete(key);
        result.key = key;
      } else {
        result.error = `The are not any open connection from ${remoteAddress}:${remotePort}`;
      }
      result.error = 'I can not manage connection without either remoteAddress and remotePort';
    }
    return result;
  }
}

class Connection {
  private _id: string;
  private _remoteAddress: string;
  private _remotePort: number;
  private _user: User;

  get id(): string {
    return this._id;
  }

  get remoteAddress(): string {
    return this._remoteAddress;
  }

  get remotePort(): number {
    return this._remotePort;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  constructor(remoteAddress: string, remotePort: number) {
    this._id = uuidV4();
    this._remoteAddress = remoteAddress;
    this._remotePort = remotePort;
  }
}
