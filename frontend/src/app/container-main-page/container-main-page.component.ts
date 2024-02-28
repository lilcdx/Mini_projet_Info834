import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ConversationPageComponent } from '../conversation-page/conversation-page.component';
import { Router } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-container-main-page',
  standalone: true,
  imports: [SidebarComponent, ConversationPageComponent, HomePageComponent],
  templateUrl: './container-main-page.component.html',
  styleUrl: './container-main-page.component.scss'
})
export class ContainerMainPageComponent {
  userConnected !: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUserLoggedIn$()
      .subscribe(user => {
        this.userConnected = user as User;
        // console.log(this.userConnected);

        console.log(this.userConnected);
        
      })    
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
  
}
