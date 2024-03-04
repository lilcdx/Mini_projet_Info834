import { Component } from '@angular/core';
import {MessageSentComponent} from "../message-sent/message-sent.component";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-conversation-page',
  standalone: true,
  imports: [
    MessageSentComponent
  ],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export class ConversationPageComponent {
  userConv!: User;

  constructor(private route: ActivatedRoute, private  userService: UserService) {}

  ngOnInit() {
    let userId = String(this.route.snapshot.paramMap.get('id'))
    console.log(userId);
    this.userService.getUserById(userId).subscribe((user: User) => {this.userConv = user}) ;
  }

  adjustHeight(event: any) {
    event.target.style.height = 'inherit';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}
