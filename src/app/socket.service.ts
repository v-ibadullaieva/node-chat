import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { IMessage, Event, IUser } from './interfaces';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private messagesData = [];

  user: Observable<IUser>;
  userList: Observable<IUser[]>;
  messages: Observable<IMessage[]>;

  constructor() {
    this.initSocket();

    const user = new ReplaySubject<IUser>(1);
    this.socket.on(Event.UPDATE_USER_INFO, (data) => user.next(data));
    this.user = user;

    const userList = new ReplaySubject<IUser[]>(1);
    this.socket.on(Event.UPDATE_USER_LIST, (data) => userList.next(data));
    this.userList = combineLatest(userList, user, (users, user) => users.filter(u => u.id !== user.id))

    const messages = new BehaviorSubject([]); 
    this.socket.on(Event.MESSAGE, (data) => {
      this.messagesData.push(data);
      messages.next(this.messagesData);
    });
    this.messages = messages;
  }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL, { transports: ['websocket'] });
  }

  public send(message: IMessage): void {
    this.socket.emit('message', message);
  }
}
