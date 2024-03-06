import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RoutesRecognized } from "@angular/router";
import { SocketioService } from '../services/socketio.service';
import { User } from '../models/user.model';
import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from '../services/user.service';
import { MessageSentComponent } from "../message-sent/message-sent.component";
import { Observable } from "rxjs";

@Component({
  selector: 'app-conversation-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MessageSentComponent
  ],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export class ConversationPageComponent implements OnInit {

  @Input() userConnected!: User;

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";

  userSelected!: User;
  chatId!: number;
  listMessages: Message[] = [];

  usersIds: Number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketioService,
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log("------------------------------ CONVERSATION PAGE");

    const userSelectedId = this.route.snapshot.params['id'];


    // -- BDD

    // Get user selected
    this.userService.getUserById(userSelectedId)
      .subscribe((data: any) => {
        this.userSelected = data;

        this.socketService.getUsers(this.APPLICATION_GLOBAL_ROOM).subscribe(users => {
          this.usersIds = Object.values(users).map((userData: any) => {
            return userData.id;
          });

          // check if this.userSelected.id is in this.usersIds
          if (this.usersIds.includes(this.userSelected.id)) {
            console.log("USER ONLINE");
            this.userSelected.online = true;
          } else {
            console.log("USER OFFLINE");
            this.userSelected.online = false;
          }
        });

      });

    // Get chat between 2 users
    this.chatService.getChatBetweenUsers(this.userConnected.id, userSelectedId)
      .subscribe((data: any) => {

        this.chatId = data.id;

        // If no chat between the 2 users exist -> Create a new Chat
        if (data.length == 0) {

          // Create chat in BDD
          this.chatService.createChat(this.userConnected.id, userSelectedId)
            .subscribe((data: any) => {
              console.log("NEW CHAT CREATE ");
              console.log(data);

              // -- SOCKET
              // Join the room named with the chat ID get in BDD
              this.socketService.joinConnectionChat(data.chat._id, this.userConnected, userSelectedId, (err: any, data: any[]) => {
                // console.log(data);
              });

              // Subscribe to the messages to be inform when a new message is send
              this.socketService.subscribeToMessages((err: any, data: any) => {
                // console.log(data);

                // Add the new message to the list of messages
                this.listMessages.push(
                  new Message(
                    data.id,
                    data.idChat,
                    data.content,
                    data.timestamp,
                    data.idSender
                  )
                );

              });

              // -- BDD
              // Get all messages from the chat              
              this.messageService.getMessagesByChatId(data.chat._id)
                .subscribe((data: any) => {
                  console.log("MESSAGES GET : ");
                  console.log(data);

                  this.listMessages = data;

                });

            });
        } else {
          console.log("CHAT GET ");
          console.log(data);


          // -- SOCKET
          // Join the room named with the chat ID get in BDD
          this.socketService.joinConnectionChat(data.id, this.userConnected, userSelectedId, (err: any, data: any[]) => {
            // console.log(data);
          });

          // Subscribe to the messages to be inform when a new message is send
          this.socketService.subscribeToMessages((err: any, data: any) => {
            // console.log(data);

            // Add the new message to the list of messages
            this.listMessages.push(
              new Message(
                data.id,
                data.idChat,
                data.content,
                data.timestamp,
                data.idSender
              )
            );
          });

          // -- BDD
          // Get all messages from the chat
          this.messageService.getMessagesByChatId(data.id)
            .subscribe((data: any) => {
              console.log("MESSAGES GET : ");
              console.log(data);

              this.listMessages = data;

            });

        }

      });

    // Create chat
    // this.chatService.createChat(this.userConnected.id, userSelectedId)
    //   .subscribe((data: any) => {
    //     console.log(data);

    //     // 
    //   });
  }

  onSubmit(f: NgForm) {

    if (f.value.content != "") {

      // -- BDD
      // Create a message in BDD
      this.messageService.createMessage(this.chatId, f.value.content, this.userConnected.id)
        .subscribe((data: any) => {
          // console.log(data);
        });


      // -- SOCKET
      // Send the message to the socket
      this.socketService.sendMessage(f.value.content, (data: any) => {
        // console.log(data);
      });

    }

  }

  adjustHeight(event: any) {
    event.target.style.height = 'inherit';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}
