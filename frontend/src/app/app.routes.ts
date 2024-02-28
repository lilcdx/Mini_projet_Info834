import { Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ConversationPageComponent } from './conversation-page/conversation-page.component';

export const routes: Routes = [
    { path: "register", component: RegisterPageComponent },
    { path: "home", component: HomePageComponent },
    { path: "conversation", component: ConversationPageComponent },
];
