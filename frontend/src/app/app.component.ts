import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {SidebarComponent} from "./sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, LoginPageComponent, RegisterPageComponent, HomePageComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'info834';
}
