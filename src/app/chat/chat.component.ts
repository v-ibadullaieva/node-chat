import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { IUser, IMessage } from '../interfaces';
import { SocketService } from '../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  userTo: Observable<IUser>;
  user: Observable<IUser>;
  messages: Observable<IMessage[]>;
  subscription: Subscription;

  constructor(
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.socketService.user;

    const userTo = combineLatest(
      this.socketService.userList,
      this.activatedRoute.paramMap,
      (users, params) => users.find(u => u.id === params.get('id'))
    )

    this.subscription = userTo.subscribe(user => {
      if (!user) {
        this.router.navigate(['/'])
      }
    })

    this.userTo = userTo.pipe(filter(user => !!user))

    this.messages = combineLatest(
      this.socketService.messages,
      this.user,
      this.userTo,
      (messages, user, userTo) =>
        messages.filter(message =>
          (message.to.id === userTo.id && message.from.id === user.id) ||
          (message.to.id === user.id && message.from.id === userTo.id)
        )
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
