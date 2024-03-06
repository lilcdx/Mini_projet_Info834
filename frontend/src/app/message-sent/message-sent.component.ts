import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { NgClass } from '@angular/common';
import { DateAgoPipe } from '../pipes/date-ago.pipe';


@Component({
  selector: 'app-message-sent',
  standalone: true,
  imports: [
    NgClass,
    DateAgoPipe
  ],
  templateUrl: './message-sent.component.html',
  styleUrl: './message-sent.component.scss'
})
export class MessageSentComponent implements OnInit {

  @Input() userConnected!: User;
  @Input() message!: Message;

  constructor() { }

  ngOnInit() {
  }

  isUserConnectedSender() {
    return this.userConnected.id === this.message.idSender;
  }

}
