import { Component } from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';

@Component({
  selector: 'app-sidebar',
  imports: [UserInfoComponent],
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent {
  sidebarVisible: boolean = false;
}
