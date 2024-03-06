import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  createChat(idUser1: Number, idUser2: Number) {
    /*
    * GOAL: Create a chat between two users
    * -> Return an observable of the chat created
    */
    const url = `http://localhost:3000/api/chat/create`;

    return this.http.post(url, { idUser1: idUser1, idUser2: idUser2 });
  }

    getChatBetweenUsers(idUser1: Number, idUser2: Number) {
      const url = `http://localhost:3000/api/chat/getChatBetweenUsers/idUser1=${idUser1.toString()}&idUser2=${idUser2.toString()}`;

      return this.http.get(url).pipe(
        map((data: any) => {
          if (data.length == 0) {
            return [];
          }
          else {
            return new Chat(data[0]._id, data[0].idUser1, data[0].idUser2);
          }
        })
      )  
  }

}
