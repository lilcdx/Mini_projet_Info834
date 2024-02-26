import { Component } from '@angular/core';

@Component({
  selector: 'app-conversation-page',
  standalone: true,
  imports: [],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export class ConversationPageComponent {
  adjustHeight(event: any) {
    event.target.style.height = 'inherit';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}
