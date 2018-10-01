export interface IMessage {
  from: IUser,
  to: IUser,
  content: string;
};

export interface IUser {
  name: string;
  id: string,
  description: string,
  logo: string
};

export enum Event {
  MESSAGE = 'message',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  UPDATE_USER_LIST = 'updateUserList',
  UPDATE_USER_INFO = 'updateUserInfo'
};
