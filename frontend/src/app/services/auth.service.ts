import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userLoggedIn$ = new Subject<User>();

  constructor(private http: HttpClient,
              protected userService: UserService) { };


  login(email: string, password: string): Observable<User> {
    return this.userService.login(email, password)
      .pipe(
        map(user => {
          let userConnected = new User(
            user._id,
            user.username,
            user.email,
            user.password,
            user.photo_url,
            user.online,
          );

          localStorage.removeItem("user_id");
          localStorage.setItem("user_id", user._id);
          this.userLoggedIn$.next(userConnected);

          return userConnected;
        })
      );
  }
  

  getUserLoggedIn$(): Observable<User | undefined> {
    let user_id = localStorage.getItem("user_id");

    if (user_id !== null) {
      // Retourne l'observable directement du service UserService
      return this.userService.getUserById(user_id);
    } else {
      // Retourne une chaîne (ou une valeur par défaut) si l'user_id n'est pas disponible
      return new Observable((observer) => {
        observer.next(undefined);
        observer.complete();
      });
    }
  }

  signup(formData: any): Observable<any> {
    return this.userService.signup(formData)
      .pipe(
        map(data => {
          localStorage.removeItem("user_id");
          localStorage.setItem("user_id", data.user_id);
          return data;  
        })
      );
  }

  logout() {
    localStorage.removeItem("user_id");
  }

  isUserConnected() {
    return localStorage.getItem("user_id") !== null;
  }
}
