import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from '../interfaces';
import { SocketService } from "../socket.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  users: Observable<IUser[]>;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.users = this.socketService.userList;
  }
}
