import { Component, Input } from '@angular/core';
import {CommonModule, NgClass, NgIf, NgStyle} from "@angular/common";
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SocketioService } from '../services/socketio.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {UserComponent} from "../user/user.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgClass,
    RouterLink,
    CommonModule,
    UserComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() userConnected!: User;

  isSidebarExtended = false;
  sidebarWidth = '7vw'; // initial width

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";

  _listUserConnected: Observable<User[]> | undefined;

  listUsersConnected: User[] = [];

  users: User[] = [];
  usersSubscription: Subscription = new Subscription();

  constructor(
      protected authService: AuthService,
      protected router: Router,
      protected route: ActivatedRoute,
      private socketService: SocketioService
  ) {}

  ngOnInit() {
    console.log("------------------------------ SIDEBAR");



    this.socketService.getUsers(this.APPLICATION_GLOBAL_ROOM).subscribe(users => {
      this.users = Object.values(users).map((userData : any) => {
        return new User(userData.id, userData.username, userData.email, userData.password, userData.photo_url, userData.online);
      });
    });

  }

  onLogOut() {
    this.authService.logout();
    this.router.navigateByUrl("/");

    // -------- SOCKET
    this.socketService.sendNotificationDisconnection(this.APPLICATION_GLOBAL_ROOM, () => {
      console.log("ACKNOWLEDGEMENT ");
    });

    this.socketService.disconnect();
  }

  extendSidebar() {
    this.isSidebarExtended = !this.isSidebarExtended;
    this.sidebarWidth = this.isSidebarExtended ? '20vw' : '7vw';
  }

}
