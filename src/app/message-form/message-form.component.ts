import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SocketService } from '../socket.service';
import { IMessage, IUser } from '../interfaces';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css']
})

export class MessageFormComponent implements OnInit {
  @Input() user: IUser;
  @Input() userTo: IUser;
  @Input() messages: IMessage[]
  messageForm: FormGroup;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      'messageInput': new FormControl(
        null,
        [Validators.required, this.isEmptyValidator()]
      )
    });
  }

  private isEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim().length > 0) {
        return null;
      } else {
        return { 'isEmpty': { value: control.value } }
      }
    };
  }

  public sendMessage(message: string): void {
    this.socketService.send({
      from: this.user,
      to: this.userTo,
      content: message
    });
  }

  onSubmit(): void {
    const form = this.messageForm;
    this.sendMessage(form.get('messageInput').value);
    form.reset();
  }
}
