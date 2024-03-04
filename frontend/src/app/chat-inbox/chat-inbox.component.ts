import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat-inbox.component.html',
  styleUrl: './chat-inbox.component.scss'
})
export class ChatInboxComponent implements OnInit {

  socket: any;
  message !: string;

  constructor() { }

  ngOnInit() {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (data: string) => {
      if (data) {

        const element = document.createElement('li');
        element.innerHTML = data;
        element.style.background = 'white';
        element.style.padding = '15px 30px';
        element.style.margin = '10px';

        const messageList = document.getElementById('message-list');
        if (messageList !== null) {
            messageList.appendChild(element);
        }
      }
    });
  }

  SendMessage() {
    this.socket.emit('message', this.message);

    const element = document.createElement('li');
    element.innerHTML = this.message;
    element.style.background = 'white';
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';

    const messageList = document.getElementById('message-list');
    if (messageList !== null) {
        messageList.appendChild(element);
    }

    this.message = '';
 }
}


