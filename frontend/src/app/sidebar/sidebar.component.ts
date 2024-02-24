import { Component } from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isSidebarExtended = false;
  sidebarWidth = '7vw'; // initial width

  extendSidebar() {
    this.isSidebarExtended = !this.isSidebarExtended;
    this.sidebarWidth = this.isSidebarExtended ? '20vw' : '7vw';
  }
}
