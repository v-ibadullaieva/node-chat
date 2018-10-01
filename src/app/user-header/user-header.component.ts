import { Component, Input } from '@angular/core';
import { IUser } from '../interfaces';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  @Input() userTo: IUser;
  @Input() user: IUser;
}
