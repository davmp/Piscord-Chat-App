import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LayoutComponent } from './components/chat/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: ChatComponent }],
  },
  { path: '**', redirectTo: '' },
];
