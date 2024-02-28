import { Component, Input } from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() userConnected!: User;
  
  isSidebarExtended = false;
  sidebarWidth = '7vw'; // initial width

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  onLogOut() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }

  extendSidebar() {
    this.isSidebarExtended = !this.isSidebarExtended;
    this.sidebarWidth = this.isSidebarExtended ? '20vw' : '7vw';
  }
}
