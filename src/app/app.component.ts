import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryTabsComponent } from './components/category-tabs/category-tabs.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, // <router-outlet> を使うために必要
    RouterLink, // [routerLink] を使うために必要
    RouterLinkActive, // [routerLinkActive] を使うために必要
    CategoryTabsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // --- ここを追加 ---
  // 初期値を 'すべて' に設定しておきます
  selectedCategory: string = 'すべて';
  // ----------------
  openAddModal() {
    console.log('ボタンがクリックされました！');
    // ここにモーダルを開く処理を記述していきます
    // 例: this.isModalOpen = true;
  }
  title = 'fashion-trends-tracker';
}
