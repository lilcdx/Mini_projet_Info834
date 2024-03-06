import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { log } from 'console';


export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:3000'
};

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;
  // listUsersConnected: User[] = [];
  // public _listUsersConnected = new BehaviorSubject<User[]>([]);
  // readonly listUserConnected$ = this._listUsersConnected.asObservable();

  private usersSubject: ReplaySubject<User[]> = new ReplaySubject<User[]>();


  constructor() { }

  setupSocketConnection(user: User, CHAT_ROOM: string) {
    /**
     * GOAL: Set up the socket connection and connect to the CHAT_ROOM global of the application
     */
    
    try {
      this.socket = io(environment.SOCKET_ENDPOINT, {
        auth: {
          user,
          CHAT_ROOM
        }
      });
    } catch (error) {
      console.error('Failed to setup socket connection:', error);
    }
  }

  joinConnectionChat = (chatId: number, userConnected: User, userSelectedId: number, cb: Function) => {
    if (this.socket)
      this.socket.on('joinChatRoom', (data: any) => {
        console.log(data);
      })

    this.socket.emit('joinChatRoom', chatId, userSelectedId, cb);
  }

  subscribeToMessages = (cb: Function) => {
    if (this.socket)
      this.socket.on('message', (data: any) => {
        // console.log(data);
        cb(null, data);
      });
  }

  sendMessage = (content: string, cb: Function) => {
    this.socket.emit('message', content, cb);
  }

  getUsers(roomName: string): Observable<any> {
    // Return observable
    return this.usersSubject.asObservable();
  }

  // -- CONNECTED
  subscribeToUsersConnected = (cb: Function): void => {
    /**
     * GOAL: Get the list of User Connected when a new event is emit on the 'usersConnected' event
     * PARAMS :
     *    - cb: callback returning the list of userConnected from the backend
     */

    if (!this.socket) return;

    this.socket.on('usersConnected', (users: User[]) => {
      this.usersSubject.next(users);
    });


    // this.socket.on('usersConnected', (data: any) => {
    //   console.log('usersConnected event received!');
    //   cb(null, data);

    //   // -- Empty the array
    //   this._listUsersConnected = new BehaviorSubject<User[]>([]);
    //   this.listUsersConnected = [];

    //   // -- Make the list with the information of users in lthe list received from the backend (data)
    //   for (let [key, value] of Object.entries(data)) {
    //     // console.log(value);
    //     this.addUser(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));
    //     this.listUsersConnected.push(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));

    //     // Get current value
    //     let currentUsers = this._listUsersConnected.value;
    //     // console.log(currentUsers);
    //     // console.log(this._listUsersConnected);
    //     // console.log(this.listUserConnected$);

    //     this._listUsersConnected.subscribe(users => {
    //       console.log("SOCKET SERVICE : Utilisateurs connectés : ", users);
    //       // Vous pouvez également faire tout autre traitement ici avec la liste d'utilisateurs
    //   });
        
        
    //     // Add new user
    //     // currentUsers.push(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));
    //     // // Emit new value
    //     // this._listUsersConnected.next(currentUsers);
        
    //   }

    //   // console.log(this._listUsersConnected);
      
    // });

  }

  sendNotificationConnection = (roomName: string, cb: Function): void => {
    /**
     * GOAL: Send an notification on the 'usersConnected' event to tell the roomName that a new connection is made
     */

    if (this.socket) this.socket.emit('usersConnected', roomName, cb);
  }

  // -- DISCONNECTED
  subscribeToUsersDisconnected = (cb: Function): void => {
    /**
     * GOAL: Get the list of User Connected when a new event is emit on the 'usersDisconnected' event
     * PARAMS :
     *    - cb: callback returning the list of userConnected from the backend     
    */

    if (!this.socket) return;

    this.socket.on('usersDisconnected', (users: User[]) => {
      this.usersSubject.next(users);
    });

    // this.socket.on('usersDisconnected', (data: any) => {
    //   console.log('usersDisconnected event received!');
    //   cb(null, data);

    //   -- Empty the array
    //   this._listUsersConnected = new BehaviorSubject<User[]>([]);
    //   this.listUsersConnected = [];

    //   -- Make the list with the information of users in lthe list received from the backend (data)
    //   for (let [key, value] of Object.entries(data)) {
    //     console.log(value);
    //     this.addUser(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));
    //     this.listUsersConnected.push(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));
    //     this.addUser(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));


    //     Get current value
    //     let currentUsers = this._listUsersConnected.value;
    //     console.log(currentUsers);
        
    //     Add new user
    //     currentUsers.push(new User((value as any).id, (value as any).username, (value as any).email, (value as any).password, (value as any).photo_url, (value as any).online));
    //     // Emit new value
    //     this._listUsersConnected.next(currentUsers);
    //   }

    //   console.log(this._listUsersConnected);
      

    // });

    

  }

  sendNotificationDisconnection = (roomName: string, cb: Function): void => {
    if (this.socket) this.socket.emit('usersDisconnected', roomName, cb);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


  // addUser(user: User) {
  //   const currentList = this._listUsersConnected.value;
  //   const updatedList = [...currentList, user];
  //   this._listUsersConnected.next(updatedList);
  // }


}
