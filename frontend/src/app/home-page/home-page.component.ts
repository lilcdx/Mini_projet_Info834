import { Component, OnInit } from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {User} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import {SocketioService} from "../services/socketio.service";
import {Subscription} from "rxjs";
import {UserComponent} from "../user/user.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    UserComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";

  users: User[] = [];
  usersSubscription: Subscription = new Subscription();

  constructor(
      protected authService: AuthService,
      protected router: Router,
      protected route: ActivatedRoute,
      private socketService: SocketioService
  ) {}

  ngOnInit() {
    console.log("HOME PAGE");



    this.socketService.getUsers(this.APPLICATION_GLOBAL_ROOM).subscribe(users => {
      this.users = Object.values(users).map((userData : any) => {
        return new User(userData.id, userData.username, userData.email, userData.password, userData.photo_url, userData.online);
      });
    });
  }
}
