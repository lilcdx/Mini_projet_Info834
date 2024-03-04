import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ConversationPageComponent} from "./conversation-page/conversation-page.component";
import { ContainerMainPageComponent } from './container-main-page/container-main-page.component';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [
      RouterOutlet, 
      CommonModule,
      LoginPageComponent, 
      RegisterPageComponent, 
      HomePageComponent, 
      SidebarComponent, 
      ConversationPageComponent,
      ContainerMainPageComponent,
      FormsModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'info834';

  constructor(
    private router: Router,
  ) {}

  isRoute(route: string): boolean {
    return this.router.url === route;
  }

}
