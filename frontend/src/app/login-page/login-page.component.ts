import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import { take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { SocketioService } from '../services/socketio.service';
// import { User } from '../models/user.model';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent{
  submit = false;
  isLoading !: boolean;
  userConnected!: User;
  errorLogin !: any | undefined;

  APPLICATION_GLOBAL_ROOM = "myRandomChatRoomId";


  constructor(private router: Router,
              protected authService: AuthService,
              private socketService: SocketioService) {}

  ngOnInit() {
    this.isLoading = false;
  }


  onSubmit(f: NgForm) {

    this.errorLogin = undefined;
    this.submit = true;
    this.isLoading = true;


    if (f.value.email != ""  && f.value.password != "" && !this.errorLoginExist()){
      this.authService.login(f.value.email, f.value.password)
          .subscribe
          (user => {
                this.userConnected = user;
                this.router.navigateByUrl("/home");
              },
              error => {
                console.error('Erreur lors de la connexion :', error.error.message);
                this.errorLogin = error.error;
              })
    }

  }

  userConnectedIsLoaded() {
    return this.userConnected !== undefined;
  }

  errorLoginExist() {
    return this.errorLogin !== undefined;
  }

  errorIsEmail() {
    return this.errorLogin.type === 'email';
  }

  errorIsPassword() {
    return this.errorLogin.type === 'password';
  }

}