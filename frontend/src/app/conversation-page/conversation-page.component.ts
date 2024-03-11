import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
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
    @ViewChild('content') private myScrollContainer!: ElementRef;

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

        // Appeler l'initialisation une première fois lors de l'initialisation du composant
        this.initializeData();

        // Surveiller les événements de navigation pour réagir aux changements d'URL
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                console.log('URL a changé : ', event.url);
                this.router.navigateByUrl(event.url);
                window.location.reload()
                // this.initializeData();
            }
        });
    }

    initializeData() {
        const userSelectedId = this.route.snapshot.params['id'];

        // Réinitialiser la liste de messages
        this.listMessages = [];

        // Charger l'utilisateur sélectionné
        this.userService.getUserById(userSelectedId)
            .subscribe((data: any) => {
                this.userSelected = data;

                // Vérifier si l'utilisateur sélectionné est en ligne
                this.socketService.getUsers(this.APPLICATION_GLOBAL_ROOM).subscribe(users => {
                    this.usersIds = Object.values(users).map((userData: any) => {
                        return userData.id;
                    });

                    if (this.usersIds.includes(this.userSelected.id)) {
                        console.log("USER ONLINE");
                        this.userSelected.online = true;
                    } else {
                        console.log("USER OFFLINE");
                        this.userSelected.online = false;
                    }
                });
            });

        // Récupérer le chat entre les 2 utilisateurs
        this.chatService.getChatBetweenUsers(this.userConnected.id, userSelectedId)
            .subscribe((data: any) => {
                this.chatId = data.id;

                // Si aucun chat entre les 2 utilisateurs n'existe -> Créer un nouveau chat
                if (data.length == 0) {
                    this.chatService.createChat(this.userConnected.id, userSelectedId)
                        .subscribe((data: any) => {
                            console.log("NEW CHAT CREATE ");
                            console.log(data);

                            // Join the room named with the chat ID get in BDD
                            this.socketService.joinConnectionChat(data.chat._id, this.userConnected, userSelectedId, (err: any, data: any[]) => {
                                // console.log(data);
                            });

                            // Subscribe to the messages to be inform when a new message is send
                            this.socketService.subscribeToMessages((err: any, data: any) => {
                                // console.log(data);
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

                            // Get all messages from the chat
                            this.messageService.getMessagesByChatId(data.chat._id)
                                .subscribe((data: any) => {
                                    console.log("MESSAGES GET : ");
                                    console.log(data);
                                    // Assurez-vous de vider la liste de messages avant d'ajouter de nouveaux messages
                                    this.listMessages = data;
                                });
                        });
                } else {
                    console.log("CHAT GET ");
                    console.log(data);

                    // Join the room named with the chat ID get in BDD
                    this.socketService.joinConnectionChat(data.id, this.userConnected, userSelectedId, (err: any, data: any[]) => {
                        // console.log(data);
                    });

                    // Subscribe to the messages to be inform when a new message is send
                    this.socketService.subscribeToMessages((err: any, data: any) => {
                        // console.log(data);
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

                    // Get all messages from the chat
                    this.messageService.getMessagesByChatId(data.id)
                        .subscribe((data: any) => {
                            console.log("MESSAGES GET : ");
                            console.log(data);
                            // Assurez-vous de vider la liste de messages avant d'ajouter de nouveaux messages
                            this.listMessages = data;
                        });
                }
            });
    }


    onSubmit(f: NgForm) {
        if (f.value.content != "") {
            // Create a message in BDD
            this.messageService.createMessage(this.chatId, f.value.content, this.userConnected.id)
                .subscribe((data: any) => {
                    // console.log(data);
                });

            // Send the message to the socket
            this.socketService.sendMessage(f.value.content, (data: any) => {
                // console.log(data);
            });

            f.resetForm();
        }
    }

    adjustHeight(event: any) {
        event.target.style.height = 'inherit';
        event.target.style.height = `${event.target.scrollHeight}px`;
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        var valeurMinimaleScroll = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        ) - window.innerHeight;
        try {
            window.scrollTo(0, valeurMinimaleScroll);
        } catch (err) { }
    }
}
