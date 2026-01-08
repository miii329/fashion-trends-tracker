import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, // <router-outlet> を使うために必要
    RouterLink, // [routerLink] を使うために必要
    RouterLinkActive, // [routerLinkActive] を使うために必要
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fashion-trends-tracker';
}
