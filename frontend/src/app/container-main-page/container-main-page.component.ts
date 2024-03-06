import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ConversationPageComponent } from '../conversation-page/conversation-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ChatInboxComponent } from '../chat-inbox/chat-inbox.component';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { SocketioService } from '../services/socketio.service';
import {RouterOutlet} from "@angular/router";

const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-container-main-page',
  standalone: true,
  imports: [
    SidebarComponent, 
    ConversationPageComponent, 
    HomePageComponent,
    ChatInboxComponent,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './container-main-page.component.html',
  styleUrl: './container-main-page.component.scss'
})
export class ContainerMainPageComponent {
  userConnected !: User;
  socket: any;
  // userList: User[] = []; // Liste des utilisateurs connectés

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketService: SocketioService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.authService.getUserLoggedIn$()
      .subscribe(user => {
        this.userConnected = user as User;

        if(this.userConnected) {
          // -------- SOCKET
          // -- Setupt the socket connection
          this.socketService.setupSocketConnection(this.userConnected, this.APPLICATION_GLOBAL_ROOM);

          // -- subscribe to event users connected
          this.socketService.subscribeToUsersConnected((err: any, data: any[]) => {
            console.log("NEW USER ", data);
          });

          // -- send notification connected
          this.socketService.sendNotificationConnection(this.APPLICATION_GLOBAL_ROOM, () => {
            console.log("ACKNOWLEDGEMENT ");
          });

          // -- subscribe to event users disconnected
          this.socketService.subscribeToUsersDisconnected((err: any, data: any[]) => {
            console.log("REMOVED USER", data);
          });
        }
      })    

      console.log("CONTAINER MAIN PAGE");
  }

  onOutletLoaded(component: { userConnected: User; }) {
    component.userConnected = this.userConnected;
  } 

  userConnectedIsLoaded() {
    return this.userConnected !== undefined;
  }

  isRoute(route: string): boolean {
    return this.router.url === route;
  }

  setUpSocketConnexion() {
    // this.socket = io(SOCKET_ENDPOINT);

    // console.log('prout 💨');

    // this.socket.on("connect", () => {
    //   console.log("Connected to server");

    //   console.log(this.socket);
      
    //   // Écouter les mises à jour de la liste des utilisateurs connectés
    //   this.socket.on('user-list', (userList: User[]) => {
    //     this.userList = userList;
    //     console.log("User list updated:", this.userList);
    //   });
    // });
  }
  
}
