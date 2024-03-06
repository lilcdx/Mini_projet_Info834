import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  createMessage(idChat: Number, content: String, idSender: Number) {
    /*
    * GOAL: Create a message bfor a chat given
    * -> Return an observable of the chat created
    */
    const url = `http://localhost:3000/api/message/create`;

    return this.http.post(
      url,
      {
        idChat: idChat,
        content: content,
        timestamp: new Date().toString(),
        idSender: idSender
      }
    );
  }

  getMessagesByChatId(idChat: String) {
    const url = `http://localhost:3000/api/message/getMessagesByChatId/idChat=${idChat.toString()}`;

    return this.http.get(url).pipe(
      map((data: any) => {
        console.log(data);
        
        return data.map((messageData: any) => {
          return new Message(
            messageData._id,
            messageData.idChat,
            messageData.content,
            messageData.timestamp,
            messageData.idSender
          );
        });
      })
    )
  }




}
