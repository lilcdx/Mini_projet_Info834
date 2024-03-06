import { Component, Input } from '@angular/core';
import {CommonModule, NgClass, NgIf, NgStyle} from "@angular/common";
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SocketioService } from '../services/socketio.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {UserComponent} from "../user/user.component";
import { UserService } from '../services/user.service';

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
  sidebarWidth = '5rem'; // initial width

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";

  _listUserConnected: Observable<User[]> | undefined;

  listUsersConnected: User[] = [];

  users: User[] = [];
  usersSubscription: Subscription = new Subscription();

  constructor(
      protected authService: AuthService,
      protected router: Router,
      protected route: ActivatedRoute,
      private socketService: SocketioService,
      private userService: UserService,
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


    this.userConnected.online = false;

    // -- BDD
    // Set user connected online true
    this.userService.manageOnlineStatus(this.userConnected.id, false)
      .subscribe((data: any) => {
        console.log("USER ONLINE STATUS UPDATED", data);
      });

    // -------- SOCKET
    this.socketService.sendNotificationDisconnection(this.APPLICATION_GLOBAL_ROOM, () => {
      console.log("ACKNOWLEDGEMENT ");
    });

    this.socketService.disconnect();
  }

  extendSidebar() {
    this.isSidebarExtended = !this.isSidebarExtended;
    this.sidebarWidth = this.isSidebarExtended ? '16rem' : '5rem';
  }

  isNewPostVisible = false;

  showNewPost() {
    this.isNewPostVisible = true;
  }

  hideNewPost(event: Event) {
    const clickedElement = event.target as Element;
    if (clickedElement.id === 'new-conv' || clickedElement.closest('#main-div')) {
      this.isNewPostVisible = false;
    }
  }

}
