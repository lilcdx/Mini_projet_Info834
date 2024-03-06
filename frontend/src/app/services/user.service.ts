import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, Observable, switchMap} from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { on } from 'events';


@Injectable({
  providedIn: "root",
})
export class UserService {
  
  constructor(private http: HttpClient) {}

  getUserById(id: string) {
    let url = `http://localhost:3000/api/user/${id}`;

    return this.http
      .get<any>(url)
      .pipe(
        map(
          (data: any) =>
            new User(
              data._id,
              data.username,
              data.email,
              data.password,
              data.photo_url,
              data.online,
            ),
        ),
      );
  }


  manageOnlineStatus(id: number, online: boolean) {
    let url = `http://localhost:3000/api/user/update/${id.toString()}`;

    return this.http
      .put<any>(url, { online: online })
      .pipe(
        map(
          (data: any) =>
            new User(
              data.user._id,
              data.user.username,
              data.user.email,
              data.user.password,
              data.user.photo_url,
              data.user.online,
            ),
        ),
      );
  }

  signup(formData: any) {
    const url = `http://localhost:3000/api/user/signup`

    return this.http.post<any>(url, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // Cas où l'authentification a échoué
            console.error('Register échouée :', error);
          } else {
            // Autres erreurs HTTP
            console.error('Erreur lors du register :', error);
          }

          // Propager l'erreur pour permettre à d'autres parties de l'application de la gérer si nécessaire
          return throwError(error);
        })
      )

  }

  login(email: string, password: string) {
    const url = `http://localhost:3000/api/user/login`

    return this.http.post<any>(url, { email, password })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Gérer le cas où l'authentification a échoué
            console.error('Authentification échouée :', error);
          } else {
            // Gérer d'autres erreurs HTTP
            console.error('Erreur lors de la connexion :', error);
          }

          // Propager l'erreur pour permettre à d'autres parties de l'application de la gérer si nécessaire
          return throwError(error);
        })
      );

  }

  getUsersByTerm(term:string){
      let url = `http://localhost:3000/api/user/searchByTerm`
      return this.http.post<any[]>(url, {"term": term })
          .pipe(
          map(usersData => {
              return usersData.map(userData => {
                  return new User(
                      userData._id,
                      userData.username,
                      userData.email,
                      userData.password,
                      userData.photo_url,
                      userData.online,
                  );
              })
          }))
  }

}
